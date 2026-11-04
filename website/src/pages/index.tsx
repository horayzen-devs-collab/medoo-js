import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, { translate } from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';

import ConsoleCode from '../components/ConsoleCode';
import Logo from '../components/Logo';
import HomepageActions from '../components/Homepage/Actions';
import HomepageBadges from '../components/Homepage/Badges';
import HomepageCodeSnippet from '../components/Homepage/CodeSnippet';
import HomepageFeatures from '../components/Homepage/Features';
import HomepageLangs from '../components/Homepage/Langs';

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const pageTitle = translate({
    id: 'home.pageTitle',
    message: '{title} - Uma biblioteca leve de bases de dados para Node.js',
    description: 'Homepage document title, including the website title.',
  }, {
    title: siteConfig.title,
  });

  return (
    <Layout
      description={translate({
        id: 'home.metaDescription',
        message: 'Uma biblioteca leve de bases de dados para Node.js.',
        description: 'Homepage meta description used by search engines.',
      })}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>
      
      <main className="hero-main">
        <Logo
          props={{
            width: 260,
            height: 260
          }}
          text={translate({
            id: 'home.logo.alt',
            message: 'Logótipo do Medoo.js',
            description: 'Alternative text for the Medoo.js logo.',
          })}
        />

        <h1>
          <Translate
            id="home.tagLine"
            description="Main headline displayed on the homepage."
          >
            Uma biblioteca leve de bases de dados para Node.js
          </Translate>
        </h1>

        <h5>
          <Translate
            id="home.version.label"
            description="Label displayed before the current library version."
          >
            Versão:
          </Translate>{' '}
          v1.2.1
        </h5>

        <a
          href="https://github.com/horayzen-devs-collab/medoo-js"
          className="btn btn-github"
        >
          <Translate
            id="home.github.button"
            description="Label of the button linking to the GitHub repository."
          >
            Ver no GitHub
          </Translate>
        </a>

        <HomepageLangs />
        <HomepageActions />
        <HomepageBadges />
        <HomepageFeatures />

        {/* Renderizar esta secção apenas quando existir um anúncio. */}
        {/*
        <div className="ads">
          <a href={adUrl} target="_blank" rel="noopener noreferrer">
            <img width="900" height="200" src={adImageUrl} alt={adAlt} />
          </a>
        </div>
        */}
      </main>

      <section className="panel">
        <header>
          <h3>
            <Translate
              id="home.getStarted.title"
              description="Heading introducing the installation instructions."
            >
              Começar
            </Translate>
          </h3>
        </header>

        <div>
          <h4>
            <Translate
              id="home.installNpm.title"
              description="Heading introducing installation through npm."
            >
              Instalação através do NPM
            </Translate>
          </h4>

          <ConsoleCode text="$ npm install @horayzen-developers/medoo-js" />

          <HomepageCodeSnippet />
        </div>
      </section>
    </Layout>
  );
}