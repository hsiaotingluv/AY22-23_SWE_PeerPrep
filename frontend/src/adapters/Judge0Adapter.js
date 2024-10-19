function stringToBase64(string) {
  return btoa(string);
}

function base64ToString(string) {
  return atob(string)
}

export function paramsToFormData(lang, code, stdin) {
  return {
    language_id: lang,
    source_code: stringToBase64(code),
    stdin: stringToBase64(stdin)
  };
}

export function dataToOutput(data) {
  return data.stdout == null
            ? JSON.stringify(base64ToString(data.stderr))
            : JSON.stringify(eval(base64ToString(data.stdout)));
}