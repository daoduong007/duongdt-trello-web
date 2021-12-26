//onKeyDown event
export const saveContentAffterPressEnter = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.blur();
  }
};
//Select all input values when click
export const selectAllInlineText = (e) => {
  e.target.focus();
  e.target.select();
};
