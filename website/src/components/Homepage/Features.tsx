
import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
        id: 'home.featureList.titleOne',
        message: 'Leve',
        description: 'Short feature title highlighting MedooJS’s lightweight design and minimal dependencies.',
      }),
    description: (
      <Translate
        id="home.featureList.descriptionOne"
        description="Feature description explaining that MedooJS is a lightweight library designed to keep dependencies to a minimum.">
        Uma biblioteca leve que mantém as dependências ao mínimo.
      </Translate>
    ),
  },
  {
    title: translate({
        id: 'home.featureList.titleTwo',
        message: 'Poderoso',
        description: 'Short feature title highlighting MedooJS’s capabilities for complex SQL queries and data handling.',
      }),
    description: (
      <Translate
        id="home.featureList.descriptionTwo"
        description="Feature description highlighting support for complex SQL queries, data mapping, and prepared statements while maintaining code readability.">
        Projetado para SQL complexo, mapeamento de dados e declarações preparadas sem sacrificar a legibilidade.
      </Translate>
    ),
  },
  {
    title: translate({
        id: 'home.featureList.titleThree',
        message: 'Compatível',
        description: 'Short feature title highlighting compatibility with multiple database engines.',
      }),
    description: (
      <Translate
        id="home.featureList.descriptionThree"
        description="Feature description listing the database engines supported by MedooJS, including MySQL, PostgreSQL, and SQLite.">
        Funciona com MySQL, PostgreSQL, SQLite e outros motores de banco de dados.
      </Translate>
    ),
  },
  {
    title: translate({
        id: 'home.featureList.titleFour',
        message: 'Amigável',
        description: 'Short feature title highlighting MedooJS’s ease of integration with Node.js database drivers.',
      }),
    description: (
      <>
        <Translate
          id="home.featureList.descriptionFour.one"
          description="Beginning of a sentence introducing the Node.js database drivers that MedooJS supports natively.">
          Suporta naturalmente
        </Translate>
        {' '}<code>mysql2</code>, <code>pg</code>
        <Translate
          id="home.featureList.descriptionFour.two"
          description="Continuation of the sentence listing supported Node.js database drivers, following the inline code names mysql2 and pg.">
          , e outros drivers de banco de dados Node.js.
        </Translate>
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className="feature">
      <Heading as="h5">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <div className="features">
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </div>
  );
}