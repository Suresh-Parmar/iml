function convertISOToFlag(isoCode: string) {
  const base = 127397; // Unicode value offset for flag emojis
  const isoChars = isoCode.toUpperCase().split('');
  const flag = isoChars.map(char => String.fromCodePoint(char.charCodeAt(0) + base)).join('');
  return flag;
}

export { convertISOToFlag };
