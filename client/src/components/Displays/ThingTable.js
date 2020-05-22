import React from 'react';
import PropTypes from 'prop-types';
// import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { 
  Button, ListItemText
} from "@material-ui/core";

let rows = [];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function ThingTableHead(props) {
  const { classes, order, orderBy, onRequestSort, columnMap } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {columnMap.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

ThingTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnMap: PropTypes.array.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const ThingTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { label } = props;

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        {label}
      </Typography>
    </Toolbar>
  );
};

ThingTableToolbar.propTypes = {
  // numSelected: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    // minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function ThingTable(props) {
  const columnMap = [
    { 
      id: 'Name', 
      numeric: false, 
      disablePadding: true, 
      label: 'Name' 
    },
    { 
      id: 'Description', 
      numeric: false, 
      disablePadding: true, 
      label: 'Description' 
    }
  ];
  rows = [];
  props.things.forEach(thing => {
    const newRow = {
      _id: thing._id,
      Name: thing.Name,
      Description: thing.Description
    };
    thing.Attributes.forEach(attr => {
      const attribute = props.attributesByID[attr.attrID];
      if (attribute.AttributeType === "Type") {
        let attrThing = props.allThings.filter(t => t._id === attr.Value);
        if (attrThing.length > 0) {
          attrThing = attrThing[0];
          newRow[attr.attrID] = attrThing.Name;
        }
      } else if (attribute.AttributeType === "List") {
        newRow[attr.attrID] = "";
        if (attribute.ListType === "Type") {
          attr.ListValues.forEach(v => {
            let attrThing = props.allThings.filter(t => t._id === v);
            if (attrThing.length > 0) {
              attrThing = attrThing[0];
              newRow[attr.attrID] += (newRow[attr.attrID].length > 0 ? ", " : "") + attrThing.Name;
            }
          });
        }
        else {
          attr.ListValues.forEach(v => {
            newRow[attr.attrID] += (newRow[attr.attrID].length > 0 ? ", " : "") + v;
          });
        }
      } else {
        newRow[attr.attrID] = attr.Value;
      }
      if (columnMap.filter(c => c.id === attr.attrID).length === 0) {
        columnMap.push({
          id: attribute._id, 
          numeric: attribute.Type === "Number", 
          disablePadding: true, 
          label: attribute.Name
        });
      }
    });
    rows.push(newRow);
  });

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Name');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  const dense = true;
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }

  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Box display={{ xs: 'none', sm: 'block' }}>
        <Paper className={classes.paper}>
          <ThingTableToolbar label={props.label} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              aria-label="enhanced table"
            >
              <ThingTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                columnMap={columnMap}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        {columnMap.map((column, key) => {
                          return (
                            <TableCell key={key}>
                              {column.id === "Name" ?
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={ _ => { props.buttonClick(row._id)}}
                                >
                                  <ListItemText primary={row.Name}/>
                                </Button>
                              :
                                <span>{row[column.id]}</span>
                              }
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          { rows.length > 5 &&
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          }
        </Paper>
      </Box>
      <Box display={{ xs: 'block', sm: 'none' }}>
        { props.label }: 
        { props.things.map((thing, i) => {
          return (
            <Button key={i} style={{ marginLeft: "4px" }}
              variant="contained" color="primary"
              onClick={ _ => { props.buttonClick(thing._id)}}>
              <ListItemText primary={thing.Name}/>
            </Button>
          );
        })}
      </Box>
    </div>
  );
}
