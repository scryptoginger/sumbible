import { Type } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type ValidationStep = {
	name: string;
	command: string;
	args: string[];
	passed: boolean;
	skipped: boolean;
	exitCode: number | null;
	killed: boolean;
	durationMs: number;
	stdout: string;
	stderr: string;
};

type ValidationResult = {
	passed: boolean;
	failedStep: string | null;
	cwd: string;
	startedAt: string;
	finishedAt: string;
	durationMs: number;
	steps: ValidationStep[];
};

const COMMANDS = [
	{
		name: "build",
		command: "npm",
		args: ["run", "build"],
		display: "npm run build",
	},
	{
		name: "lint:content",
		command: "npm",
		args: ["run", "lint:content"],
		display: "npm run lint:content",
	},
	{
		name: "astro check",
		command: "npx",
		args: ["astro", "check"],
		display: "npx astro check",
	},
] as const;

function formatSummary(result: ValidationResult): string {
	const lines = [
		`validation: ${result.passed ? "PASS" : "FAIL"}`,
		`cwd: ${result.cwd}`,
		`durationMs: ${result.durationMs}`,
		`failedStep: ${result.failedStep ?? "none"}`,
		"steps:",
	];

	for (const step of result.steps) {
		const status = step.skipped ? "SKIPPED" : step.passed ? "PASS" : "FAIL";
		lines.push(`- ${status} ${step.command} ${step.args.join(" ")} (${step.durationMs}ms, exit=${step.exitCode ?? "null"})`);
	}

	return `${lines.join("\n")}\n\nStructured result:\n${JSON.stringify(result, null, 2)}`;
}

export default function (pi: ExtensionAPI) {
	pi.registerTool({
		name: "validate",
		label: "Validate",
		description:
			"Run the SumBible validation gate from AGENTS.md: npm run build, npm run lint:content, then npx astro check. Stops on the first failure and returns structured pass/fail output.",
		promptSnippet: "Run the SumBible validation gate from AGENTS.md with structured pass/fail output.",
		promptGuidelines: [
			"Use validate when the user asks to validate SumBible changes or to run the AGENTS.md build gate.",
			"The validate tool runs npm run build, npm run lint:content, and npx astro check sequentially; it stops on first failure.",
		],
		parameters: Type.Object({}),
		async execute(_toolCallId, _params, signal, onUpdate, ctx) {
			const startedAt = new Date();
			const steps: ValidationStep[] = [];
			let failedStep: string | null = null;

			for (const item of COMMANDS) {
				if (failedStep) {
					steps.push({
						name: item.name,
						command: item.command,
						args: [...item.args],
						passed: false,
						skipped: true,
						exitCode: null,
						killed: false,
						durationMs: 0,
						stdout: "",
						stderr: `Skipped because ${failedStep} failed.`,
					});
					continue;
				}

				onUpdate?.({ content: [{ type: "text", text: `Running ${item.display}...` }] });
				const stepStarted = Date.now();
				const execResult = await pi.exec(item.command, [...item.args], {
					signal,
					timeout: 10 * 60 * 1000,
				});
				const durationMs = Date.now() - stepStarted;
				const passed = execResult.code === 0 && !execResult.killed;

				steps.push({
					name: item.name,
					command: item.command,
					args: [...item.args],
					passed,
					skipped: false,
					exitCode: execResult.code,
					killed: execResult.killed,
					durationMs,
					stdout: execResult.stdout,
					stderr: execResult.stderr,
				});

				if (!passed) {
					failedStep = item.name;
				}
			}

			const finishedAt = new Date();
			const result: ValidationResult = {
				passed: failedStep === null,
				failedStep,
				cwd: ctx.cwd,
				startedAt: startedAt.toISOString(),
				finishedAt: finishedAt.toISOString(),
				durationMs: finishedAt.getTime() - startedAt.getTime(),
				steps,
			};

			return {
				content: [{ type: "text", text: formatSummary(result) }],
				details: result,
			};
		},
	});
}
