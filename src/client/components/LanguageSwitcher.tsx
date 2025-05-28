import { SegmentedControl } from '@mantine/core';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SegmentedControl
      style={{width: '200px'}}
      value={i18n.language}
      onChange={changeLanguage}
      data={[
        { label: 'עברית', value: 'he' },
        { label: 'ไทย', value: 'th' },
      ]}
    />
  );
}

export default LanguageSwitcher; 