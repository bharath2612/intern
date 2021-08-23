import { filter } from "lodash";
import { Icon } from "@iconify/react";
// import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import avatar from "../images/avatar_default.jpg";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@material-ui/core";

// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
// import SearchNotFound from "../components/SearchNotFound";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../components/User";

// ----------------------------------------------------------------------

// import USERLIST from "../mocks/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "isValidToken", label: "Status", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "username", label: "User", alignRight: false },
  { id: "subscribedStrategies", label: "Strategies", alignRight: false },
  // { id: "qty", label: "Qty", alignRight: false },
  { id: "postitions", label: "Positions", alignRight: false },
  { id: "pnl", label: "PnL", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [MIS, setMIS] = useState(false);
  const [LOGIN, setLOGIN] = useState(false);
  const [values, setValues] = useState({
    USERLIST: [],
  });
  const { USERLIST } = values;

  useEffect(() => {
    const interval = setInterval(() => {
      loadAllData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = () => {
    axios
      .get(`http://139.59.9.19:4999/api/positions`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // console.log("IMAGE UPLOAD RES DATA", res);
        let AllValues = [];
        AllValues.push(res.data.data);
        setValues({ ...values, USERLIST: AllValues[0] });
        // console.log("USERLIST", USERLIST);
        // console.log("allval", AllValues[0]);
      })
      .catch((err) => {
        console.log("UPLOAD ERR", err);
      });
  };

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
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, query) {
    console.log("array", array);
    if (array.length === 0) {
      loadAllData();
      console.log("loop check");
    }
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(
        array,
        (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST[0].length) : 0;

  const filteredUsers = applySortFilter(
    USERLIST,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Table | AlphaBot">
      <Container className="mw-100">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            setMIS={setMIS}
            MIS={MIS}
            LOGIN={LOGIN}
            setLOGIN={setLOGIN}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length === 0 ? 0 : USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {LOGIN
                    ? filteredUsers
                        .filter((f) => f.isValidToken)
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            id,
                            name,
                            username,
                            isValidToken,
                            broker,
                            subscribedStrategies,
                            postitions,
                          } = row;
                          const isItemSelected = selected.indexOf(name) !== -1;

                          return (
                            <TableRow
                              hover
                              key={id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={(event) => handleClick(event, name)}
                                />
                              </TableCell>
                              <TableCell align="left">
                                {isValidToken ? (
                                  <CheckCircleIcon className="text-success" />
                                ) : (
                                  <CancelIcon className="text-danger" />
                                )}
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar alt={name} src={avatar} />
                                  <p className="name">{name}</p>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">
                                <p className="userid">
                                  {username} ({broker})
                                </p>
                              </TableCell>
                              <TableCell align="left">
                                {subscribedStrategies
                                  .filter((s) => s.qty > 0)
                                  .map((s) => (
                                    <div>
                                      <Label
                                        variant="outlined"
                                        color={"default"}
                                      >
                                        {s.nameOfStrategy} {": "} {s.qty}
                                      </Label>
                                      <br />
                                    </div>
                                  ))}
                              </TableCell>
                              <TableCell align="left">
                                {MIS
                                  ? postitions
                                      .filter((f) => f.productType === "MIS")
                                      .map((s) => (
                                        <div>
                                          <Label
                                            variant="outlined"
                                            color="default"
                                          >
                                            {s.productType}[{s.qty}]&nbsp;
                                            <span className="qty">
                                              {s.symbol}
                                            </span>
                                            &nbsp;
                                          </Label>
                                          <Label
                                            variant="ghost"
                                            color={
                                              (s.qty === 0 && "default") ||
                                              (Math.sign(s.pnl) === -1 &&
                                                "error") ||
                                              (Math.sign(s.pnl) === 1 &&
                                                "primary") ||
                                              "default"
                                            }
                                          >
                                            {s.pnl !== null
                                              ? [s.pnl.toFixed(2)]
                                              : "null"}
                                          </Label>
                                          <br />
                                        </div>
                                      ))
                                  : postitions.map((s) => (
                                      <div>
                                        <Label
                                          variant="outlined"
                                          color="default"
                                        >
                                          {s.productType}[{s.qty}]&nbsp;
                                          <span className="qty">
                                            {s.symbol}
                                          </span>
                                          &nbsp;
                                        </Label>
                                        <Label
                                          variant="ghost"
                                          color={
                                            (s.qty === 0 && "default") ||
                                            (Math.sign(s.pnl) === -1 &&
                                              "error") ||
                                            (Math.sign(s.pnl) === 1 &&
                                              "primary") ||
                                            "default"
                                          }
                                        >
                                          {s.pnl !== null
                                            ? [s.pnl.toFixed(2)]
                                            : "null"}
                                        </Label>
                                        <br />
                                      </div>
                                    ))}
                              </TableCell>
                              <TableCell align="left">
                                {Math.sign(
                                  postitions
                                    .reduce((cv, nv) => {
                                      return cv + nv.pnl;
                                    }, 0)
                                    .toFixed(2)
                                ) === -1 ? (
                                  <h4 className="text-danger pnl">
                                    {postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)}
                                  </h4>
                                ) : Math.sign(
                                    postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)
                                  ) === 1 ? (
                                  <h4 className="text-success pnl">
                                    {postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)}
                                  </h4>
                                ) : (
                                  <h4 className="pnl">
                                    {postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)}
                                  </h4>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <UserMoreMenu />
                              </TableCell>
                            </TableRow>
                          );
                        })
                    : filteredUsers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            id,
                            name,
                            username,
                            isValidToken,
                            broker,
                            subscribedStrategies,
                            postitions,
                          } = row;
                          const isItemSelected = selected.indexOf(name) !== -1;

                          return (
                            <TableRow
                              hover
                              key={id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={(event) => handleClick(event, name)}
                                />
                              </TableCell>
                              <TableCell align="left">
                                {isValidToken ? (
                                  <CheckCircleIcon className="text-success" />
                                ) : (
                                  <CancelIcon className="text-danger" />
                                )}
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar alt={name} src={avatar} />
                                  <p className="name"> {name}</p>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">
                                <p className="userid">
                                  {username} ({broker})
                                </p>
                              </TableCell>
                              <TableCell align="left">
                                {subscribedStrategies
                                  .filter((s) => s.qty > 0)
                                  .map((s) => (
                                    <div>
                                      <Label
                                        variant="outlined"
                                        color={"default"}
                                      >
                                        {s.nameOfStrategy} {": "} {s.qty}
                                      </Label>
                                      <br />
                                    </div>
                                  ))}
                              </TableCell>

                              <TableCell align="left">
                                {MIS
                                  ? postitions
                                      .filter((f) => f.productType === "MIS")
                                      .map((s) => (
                                        <div>
                                          <Label
                                            variant="outlined"
                                            color="default"
                                          >
                                            {s.productType}[{s.qty}]&nbsp;
                                            <span className="qty">
                                              {s.symbol}
                                            </span>
                                            &nbsp;
                                          </Label>
                                          <Label
                                            variant="ghost"
                                            color={
                                              (s.qty === 0 && "default") ||
                                              (Math.sign(s.pnl) === -1 &&
                                                "error") ||
                                              (Math.sign(s.pnl) === 1 &&
                                                "primary") ||
                                              "default"
                                            }
                                          >
                                            {s.pnl !== null
                                              ? [s.pnl.toFixed(2)]
                                              : "null"}
                                          </Label>
                                          <br />
                                        </div>
                                      ))
                                  : postitions.map((s) => (
                                      <div>
                                        <Label
                                          variant="outlined"
                                          color="default"
                                        >
                                          {s.productType}[{s.qty}]&nbsp;
                                          <span className="qty">
                                            {s.symbol}
                                          </span>
                                          &nbsp;
                                        </Label>
                                        <Label
                                          variant="ghost"
                                          color={
                                            (s.qty === 0 && "default") ||
                                            (Math.sign(s.pnl) === -1 &&
                                              "error") ||
                                            (Math.sign(s.pnl) === 1 &&
                                              "primary") ||
                                            "default"
                                          }
                                        >
                                          {s.pnl !== null
                                            ? [s.pnl.toFixed(2)]
                                            : "null"}
                                        </Label>
                                        <br />
                                      </div>
                                    ))}
                              </TableCell>
                              <TableCell align="left">
                                {Math.sign(
                                  postitions
                                    .reduce((cv, nv) => {
                                      return cv + nv.pnl;
                                    }, 0)
                                    .toFixed(2)
                                ) === -1 ? (
                                  <h4 className="text-danger pnl">
                                    {postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)}
                                  </h4>
                                ) : Math.sign(
                                    postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)
                                  ) === 1 ? (
                                  <h4 className="text-success pnl">
                                    {postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)}
                                  </h4>
                                ) : (
                                  <h4 className="pnl">
                                    {postitions
                                      .reduce((cv, nv) => {
                                        return cv + nv.pnl;
                                      }, 0)
                                      .toFixed(2)}
                                  </h4>
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <UserMoreMenu />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <LinearProgress color="primary" />
                        {/* <SearchNotFound searchQuery={filterName} /> */}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 30, USERLIST.length]}
            component="div"
            count={USERLIST.length === 0 ? 0 : USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
