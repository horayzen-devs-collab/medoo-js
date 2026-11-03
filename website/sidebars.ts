import { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Primeiros Passos',
      collapsed: false,
      items: [
        'setup',
      ],
    },
    {
      type: 'category',
      label: 'Sintaxe do WHERE',
      collapsed: false,
      items: [
        'syntax/where',
      ],
    },
    {
      type: 'category',
      label: 'Métodos',
      collapsed: false,
      items: [
        'methods/select',
        'methods/insert',
        'methods/update',
        'methods/delete',
        'methods/get',
      ],
    },
  ],
};

export default sidebars;