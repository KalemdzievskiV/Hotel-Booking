import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

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
  totalCount
}: CustomTableProps) {
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
                  textAlign: column.align || 'left'
                }}
              >
                {column.label}
              </TableCell>
            ))}
            {onDelete && <TableCell sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
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
          count={totalCount || data.length}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </TableContainer>
  );
} 