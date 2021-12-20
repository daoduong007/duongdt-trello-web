export const mapOder = (array, oder, key) => {
  array.sort((a, b) => oder.indexOf(a[key]) - oder.indexOf(b[key]));
  return array;
};
