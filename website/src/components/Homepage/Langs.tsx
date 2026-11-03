import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type LangItem = {
  id: string;
  label: string;
  href: string;
  active: bolean;
};

function LangsList({ locales, localeConfigs, defaultLocale, currentLocale }) {
  const {siteConfig} = useDocusaurusContext();
  
  const langs: LangItem[] = locales.map(locale => {
    const {label} = localeConfigs[locale];
    const href = '/medoo-js/' + ((locale === defaultLocale) ? '' : locale);
    const active = locale === currentLocale;
    const [id] = locale.split('-');

    const lang: LangItem = {
      id: id.toUpperCase(),
      label,
      href,
      active,
    };

    return lang;
  });

  return langs;
}

function Lang({id, label, href, active}: LangItem) {
  return (
    <a href={href} className={clsx(
      "lang",
      { "on": active }
    )}>
      <span>{id}</span>
      {label}
    </a>
  );
}

export default function HomepageLangs(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const list = LangsList(i18n);

  return (
    <div className="langs">
      {list.map((props, idx) => (
        <Lang key={idx} {...props} />
      ))}
    </div>
  );
}
