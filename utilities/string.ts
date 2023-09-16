export const capitalize = (input: string) => {
  let words = input.split(' ');
  let capitalizedWords: string[] = [];
  words.forEach((element) => {
    capitalizedWords.push(
      element[0].toUpperCase() + element.slice(1, element.length)
    );
  });
  return capitalizedWords.join(' ');
};
