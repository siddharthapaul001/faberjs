import { getDisplayProperty } from "../utils";
import { computeLayout } from "../mason";
import tsa from "./track-sizing";

const computeGridLayout = (domTree) => {
  const gridMatrix = [],
    styles = domTree.style || {},
    children = domTree.children || [],
    { templateRows, templateColumns } = styles,
    withinBounds = (rowStart, rowEnd, colStart, colEnd) => {
      return rowStart >= 0
        && rowStart < templateRows.length
        && rowEnd >= 0
        && rowEnd < templateRows.length
        && colStart >= 0
        && colStart < templateColumns.length
        && colEnd >= 0
        && colEnd < templateColumns.length;
    },
    inflateGridCells = () => {
      const rowsWithSize = tsa.resolveTracks(templateRows),
        // TODO: repeat if sizes were changed
        columnsWithSize = tsa.resolveTracks(templateColumns);

      let i;
      for (i = 0; i < rowsWithSize.length; i++) {
        gridMatrix.push(columnsWithSize.map(c => {
          return {
            width: c.width,
            height: c.height,
            bounds: c.bounds
          };
        }));
      }
    };

  // if (getDisplayProperty(domTree)) {
  //   //TODO: fix me
  //   return computeLayout(domTree);
  // }

  // Size the rows and tracks
  // Create the grid matrix
  inflateGridCells();

  // Allocate children to grid matrix
  children.forEach(child => {
    const { gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd } = child;
    if (withinBounds(gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd)) {
      // array of cells this child occupies
      child.matrixPosition = [{
        row: gridRowStart - 1,
        column: gridColumnStart - 1
      }];
    }
  });

};

export default computeGridLayout;