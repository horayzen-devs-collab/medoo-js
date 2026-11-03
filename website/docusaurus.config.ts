import { Config } from '@docusaurus/types';
import preset from '@docusaurus/preset-classic';
import { themes } from 'prism-react-renderer';

const config: Config = {
  title: 'MedooJS',
  titleDelimiter: '-',
  tagline: 'A lightweight database library with smart engine inference and robust SQL injection prevention',
  favicon: 'img/favicon.ico',

  url: 'https://horayzen-devs-collab.github.io',
  baseUrl: '/medoo-js/',
  organizationName: 'horayzen-devs-collab',
  projectName: 'medoo-js',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'pt-PT',
    locales: ['pt-PT', 'en', 'fr'],
    localeConfigs: {
      'pt-PT': {
        label: 'Português (PT)'
      }
    }
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'api',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/horayzen-developers/medoo-js/tree/main/website/',
        },
        theme: {
          customCss: './src/css/styles.css',
        },
      } satisfies preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'MedooJS',
      logo: {
        alt: 'MedooJS logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          label: 'Primeiros Passos',
        },
        {
          label: 'Documentação',
          to: '/documentation',
        },
        {
          label: 'Sobre',
          to: '/about',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          label: 'Ver no GitHub',
          href: 'https://github.com/horayzen-developers/medoo-js',
        },
      ],
      copyright: `Grupo HORAYZEN Developers®, Todos os direitos reservados, ${new Date().getFullYear()}`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.okaidia,
    },
  } satisfies preset.ThemeConfig,
};

export default config;