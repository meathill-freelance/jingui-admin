/**
 * Created by meathill on 2017/5/26.
 */

function fix2(number) {
  return number < 10 ? '0' + number : number;
}

export let formatDate = date => {
  date = date || new Date();
  return [date.getFullYear(), fix2(date.getMonth() + 1), fix2(date.getDate())].join('-');
};