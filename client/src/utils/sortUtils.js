export default class SortUtils {
  /**
   * Compare and sort two string values
   * @param {string} valueA First string value
   * @param {string} valueB Second string value
   * @param {string} order Order to sort by: 'asc' or 'desc'
   */
  static sortByStringValue = (valueA, valueB, order) => {
    if (order === 'asc') {
      return valueA.toLocaleLowerCase() > valueB.toLocaleLowerCase() ? 1 : -1
    } else {
      return valueA.toLocaleLowerCase() > valueB.toLocaleLowerCase() ? -1 : 1
    }
  }

  /**
   * Compare and sort two numeric values
   * @param {number} valueA First numeric value
   * @param {number} valueB Second numeric value
   * @param {number} order Order to sort by: 'asc' or 'desc
   */
  static sortByNumericValue = (valueA, valueB, order) => {
    if (order === 'asc') {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA > valueB ? -1 : 1
    }
  }
}