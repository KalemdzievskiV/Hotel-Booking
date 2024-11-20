import { 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
  Divider,
  TableSortLabel
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  format?: (value: any) => string;
}

type Order = 'asc' | 'desc';

interface CustomTableProps {
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete?: (item: any) => void;
  renderCell: (column: Column, item: any) => React.ReactNode;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  totalCount?: number;
  defaultSortColumn?: string;
  onSort?: (column: string, order: Order) => void;
}

export default function CustomTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  renderCell,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  defaultSortColumn,
  onSort
}: CustomTableProps) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const [orderBy, setOrderBy] = useState<string>(defaultSortColumn || '');
  const [order, setOrder] = useState<Order>('asc');

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange?.(parseInt(event.target.value, 10));
  };

  const handleSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(columnId);
    onSort?.(columnId, newOrder);
  };

  const sortData = (data: any[]) => {
    if (!orderBy || !onSort) {
      return data;
    }

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.id === orderBy);
      if (!column) return 0;

      const aValue = column.format ? column.format(a[orderBy]) : a[orderBy];
      const bValue = column.format ? column.format(b[orderBy]) : b[orderBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return order === 'asc'
        ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
        : (bValue < aValue ? -1 : bValue > aValue ? 1 : 0);
    });
  };

  const sortedData = sortData(data);

  if (isCompact) {
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          {columns.filter(col => col.sortable).map((column) => (
            <TableSortLabel
              key={column.id}
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={() => handleSort(column.id)}
              sx={{ mr: 2, mb: 1 }}
            >
              <Typography variant="subtitle2" component="span">
                {column.label}
              </Typography>
            </TableSortLabel>
          ))}
        </Box>
        {sortedData.map((item, index) => (
          <Card 
            key={item.id} 
            sx={{ 
              mb: 3,
              backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#fff",
              "&:hover": { backgroundColor: "#e0f7fa" },
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {columns.map((column, colIndex) => (
                <Box key={column.id}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      mb: 2
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {column.label}
                    </Typography>
                    <Typography 
                      sx={{ 
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {renderCell(column, item)}
                    </Typography>
                  </Box>
                  {colIndex < columns.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
              <Stack 
                direction="row" 
                spacing={2} 
                justifyContent="flex-end" 
                sx={{ mt: 3 }}
              >
                <IconButton 
                  size="medium" 
                  color="primary" 
                  onClick={() => onEdit(item)}
                  sx={{
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.15)',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
                {onDelete && (
                  <IconButton 
                    size="medium" 
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                    sx={{
                      backgroundColor: 'rgba(211, 47, 47, 0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.15)',
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
        {onPageChange && onRowsPerPageChange && (
          <TablePagination
            component="div"
            count={totalCount || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-select': {
                minHeight: '20px',
              },
            }}
          />
        )}
      </Box>
    );
  }

  return (
    <TableContainer className="mx-2" style={{ marginTop: "20px" }}>
      <Table
        size="medium"
        sx={{
          marginTop: "10vh",
          margin: "auto",
          maxWidth: "100%",
          backgroundColor: "white",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          borderRadius: "10px",
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#4a148c" }}>
            {columns.map((column) => (
              <TableCell 
                key={column.id}
                align={column.align || 'left'}
                sx={{ 
                  color: "#fff", 
                  fontWeight: "bold",
                  textAlign: column.align || 'left',
                  whiteSpace: 'nowrap'
                }}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: '#fff !important',
                      },
                      '&.Mui-active': {
                        color: '#fff !important',
                      },
                      '&:hover': {
                        color: '#fff !important',
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            {onDelete && <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow
              key={item.id}
              sx={{
                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#fff",
                "&:hover": { backgroundColor: "#e0f7fa" },
                cursor: "pointer"
              }}
              onDoubleClick={() => onEdit(item)}
            >
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  align={column.align || 'left'}
                  component={column.id === columns[0].id ? "th" : "td"}
                  scope={column.id === columns[0].id ? "row" : undefined}
                  sx={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px'
                  }}
                >
                  {renderCell(column, item)}
                </TableCell>
              ))}
              {onDelete && (
                <TableCell align="center">
                  <Chip
                    label="Delete"
                    color="error"
                    clickable
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                    sx={{ cursor: "pointer" }}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {onPageChange && onRowsPerPageChange && (
        <TablePagination
          component="div"
          count={totalCount || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  );
}