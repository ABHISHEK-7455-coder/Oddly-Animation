import * as components from "../components";

export function DemoMixer(ctx, demoConfig) {
  const cleanups = [];

  demoConfig.components.forEach(({ name, options }) => {
    const componentFn = components[name];

    if (!componentFn) {
      console.error(`Component "${name}" not found`);
      return;
    }

    const cleanup = componentFn(ctx, options);
    cleanups.push(cleanup);
  });

  return () => cleanups.forEach(fn => fn && fn());
}
