import * as React from "react";
import { Component } from "react";
import { sp } from '@pnp/sp';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface IDocument {
  id: number;
  name: string;
  url?: string; // Make the URL property optional
}

interface IDocumentLibraryState {
  documents: IDocument[];
  anchorEl: null | HTMLElement;
}

export default class LibraryData extends Component<{}, IDocumentLibraryState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      documents: [],
      anchorEl: null,
    };
  }

  public componentDidMount(): void {
    this.loadDocuments();
  }

  private async loadDocuments(): Promise<void> {
    try {
      const data = await sp.web.lists.getByTitle('Contact').items.select('FileLeafRef', 'EncodedAbsUrl', 'Id').get();
      const documents: IDocument[] = data.map((item: any) => ({
        id: item.Id,
        name: item.FileLeafRef.split('_').slice(1).join('_'),
        url: item.EncodedAbsUrl
      }));
      this.setState({ documents: documents });
    } catch (error) {
      console.error('Error loading documents', error);
    }
  }

  private handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  private handleViewDocument = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
      this.handleMenuClose();
    }
  };
  

  render() {
    const columns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'name', headerName: 'File Name', width: 300 },
      {
        field: 'actions',
        headerName: '',
        width: 100,
        renderCell: (params) => (
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleMenuOpen}
          >
            ...
          </IconButton>
        ),
      },
    ];

    return (
      <div style={{ height: 400, width: '100%' }}>
        <h2>Document Library</h2>
        <DataGrid
          rows={this.state.documents}
          columns={columns}
        />
        <Menu
  id="simple-menu"
  anchorEl={this.state.anchorEl}
  keepMounted
  open={Boolean(this.state.anchorEl)}
  onClose={this.handleMenuClose}
>
  {this.state.documents.map((document, index) => (
    <MenuItem key={index} onClick={() => this.handleViewDocument(document.url)}>View {document.name}</MenuItem>
  ))}
  <MenuItem onClick={this.handleMenuClose}>Download</MenuItem>
  <MenuItem onClick={this.handleMenuClose}>Like</MenuItem>
  <MenuItem onClick={this.handleMenuClose}>Rate</MenuItem>
  <MenuItem onClick={this.handleMenuClose}>Check In</MenuItem>
  <MenuItem onClick={this.handleMenuClose}>Check Out</MenuItem>
  <MenuItem onClick={this.handleMenuClose}>Versions</MenuItem>
</Menu>

      </div>
    );
  }
}
