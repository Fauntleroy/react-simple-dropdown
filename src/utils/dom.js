export function pixelStringToInteger (marginString) {
  return parseInt((marginString || '').replace('px', ''), 10) || 0;
}

export function getElementOuterHeight (element) {
  const height = element.offsetHeight || element.outerHeight;
  const styles = window.getComputedStyle(element);
  const verticalMargin = pixelStringToInteger(styles['margin-top']) + pixelStringToInteger(styles['margin-bottom']);

  return height + verticalMargin;
}

export function getElementOuterWidth (element) {
  const width = element.offsetWidth || element.outerWidth;
  const styles = window.getComputedStyle(element);
  const horizontalMargin = pixelStringToInteger(styles['margin-left']) + pixelStringToInteger(styles['margin-right']);

  return width + horizontalMargin;
}
