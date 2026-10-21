import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-vite",
  features: {
    // Disable the "Get started" onboarding checklist in the sidebar
    sidebarOnboardingChecklist: false,
  },
  async viteFinal(config) {
    config.server = config.server || {};
    config.server.allowedHosts = true as any;
    return config;
  },
};
export default config;