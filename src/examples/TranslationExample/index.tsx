import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationExample = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
    console.log('Current language:', navigator.language);
    console.log('Translation example:', t('example.test'));

    return () => {};
  });

  return null;
};

export default TranslationExample;
