import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';

const titlecase = (input: string) =>
  input[0].toLocaleUpperCase() + input.slice(1);

export const pascalcase = (value: string) => {
  if (isNil(value)) {
    return '';
  }
  if (!isFunction(value.toString)) {
    return '';
  }

  const input = value.toString().trim();
  if (input === '') {
    return '';
  }
  if (input.length === 1) {
    return input.toLocaleUpperCase();
  }

  const match = input.match(/[a-zA-Z0-9]+/g);
  if (match) {
    return match.map((m) => titlecase(m)).join('');
  }

  return input;
};
