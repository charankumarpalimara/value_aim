import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  Button as MuiButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import {
  Input,
  Button,
  Modal as AntdModal,
  Typography as AntdTypography,
  message,
  Spin,
} from "antd";
// import axios from "axios"; // Uncomment when connecting to actual API

const { TextArea } = Input;

const NotesTab = () => {
  // Responsive breakpoints
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Colors matching the theme
  const blueAccent = "#201F47";

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setName("");
    setDescription("");
    setIsLoading(false);
  };

  const fetchNotes = async () => {
    try {
      // For now, we'll use mock data since we don't have the actual API
      // Replace this with actual API call when backend is available
      const mockNotes = [
        {
          id: 1,
          name: "Quarterly Business Review",
          description: "Prepare comprehensive Q3 business review with key metrics and strategic initiatives for stakeholder presentation.",
          date: "October 13, 2025"
        },
        {
          id: 2,
          name: "Partnership Strategy",
          description: "Outline potential partnership opportunities with key industry players for market expansion.",
          date: "October 12, 2025"
        },
        {
          id: 3,
          name: "Customer Feedback Analysis",
          description: "Review and analyze recent customer feedback to identify improvement areas and action items.",
          date: "October 11, 2025"
        },
        {
          id: 4,
          name: "Revenue Optimization",
          description: "Identify revenue leak points and develop strategies to optimize pricing and upsell opportunities.",
          date: "October 10, 2025"
        },
        {
          id: 5,
          name: "Market Research Findings",
          description: "Summarize recent market research data and competitor analysis for strategic planning.",
          date: "October 9, 2025"
        }
      ];
      setNotes(mockNotes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      message.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleEditClick = (note) => {
    setEditNote(note);
    setEditName(note.name);
    setEditDescription(note.description);
    setEditModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      message.warning("Please enter both name and description.");
      return;
    }
    try {
      setIsLoading(true);
      
      // Mock create - replace with actual API call
      const newNote = {
        id: Date.now(),
        name,
        description,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      
      setNotes(prev => [newNote, ...prev]);
      message.success("Note created successfully");
      setIsLoading(false);
      setOpenModal(false);
      setName("");
      setDescription("");
    } catch (err) {
      message.error("Failed to create note");
      console.error("Failed to create note", err);
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editName.trim() || !editDescription.trim()) {
      message.warning("Please enter both name and description.");
      return;
    }
    try {
      setIsLoading(true);
      
      // Mock update - replace with actual API call
      setNotes(prev => prev.map(note => 
        note.id === editNote.id 
          ? { ...note, name: editName, description: editDescription }
          : note
      ));
      
      message.success("Note updated successfully");
      setEditModalOpen(false);
      setEditNote(null);
      setEditName("");
      setEditDescription("");
      setIsLoading(false);
    } catch (err) {
      message.error("Failed to update note");
      console.error("Failed to update note", err);
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async () => {
    try {
      setIsLoading(true);
      
      // Mock delete - replace with actual API call
      setNotes(prev => prev.filter(note => note.id !== editNote.id));
      
      message.success("Note deleted successfully");
      setEditModalOpen(false);
      setEditNote(null);
      setEditName("");
      setEditDescription("");
      setIsLoading(false);
    } catch (err) {
      message.error("Failed to delete note");
      console.error("Failed to delete note", err);
      setIsLoading(false);
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic columns based on screen size
  const columns = isDesktop ? 5 : isTablet ? 3 : 1;

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            color: "#fff",
            fontSize: "20px",
          }}
        >
          <Spin size="large" fullscreen />
        </div>
      )}
      <Box sx={{ 
        padding: isMobile ? 1 : isTablet ? 2 : 3,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="center"
          alignItems="center"
          paddingX={isMobile ? 1 : isTablet ? 3 : 5}
          p={isMobile ? 2 : 3}
          gap={2}
          sx={{ width: '100%', boxSizing: 'border-box' }}
        >
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            prefix={<SearchIcon style={{ color: "rgba(0,0,0,.25)" }} />}
            style={{
              height: isMobile ? "40px" : "34px",
              width: isMobile ? "100%" : isTablet ? "60%" : "50%",
              borderRadius: "3px",
              border: "none",
              boxShadow: "none",
              fontSize: isMobile ? "14px" : "inherit",
            }}
          />
          <Button
            type="primary"
            onClick={handleOpenModal}
            className="form-button"
            icon={<AddIcon />}
            style={{
              background: blueAccent,
              color: "#fff",
              height: isMobile ? "40px" : "34px",
              borderRadius: "4px",
              textTransform: "none",
              width: isMobile ? "100%" : "auto",
              fontSize: isMobile ? "14px" : "inherit",
            }}
          >
            Create New
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: isMobile ? 1.5 : 2,
            padding: isMobile ? 1 : isTablet ? 2 : 0,
            paddingX: isMobile ? 1 : isTablet ? 2 : 3,
          }}
        >
          {filteredNotes.map((note, index) => (
            <Box
              key={note.id || index}
              sx={{
                padding: isMobile ? 1.5 : 2,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                position: "relative",
                minHeight: isMobile ? 180 : isTablet ? 200 : 220,
                maxHeight: isMobile ? 180 : isTablet ? 200 : 220,
                height: isMobile ? 180 : isTablet ? 200 : 220,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <Typography
                  sx={{ 
                    fontWeight: "500", 
                    marginBottom: 1, 
                    fontSize: isMobile ? "14px" : "16px",
                    lineHeight: isMobile ? "1.3" : "1.5",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    flexShrink: 0,
                  }}
                >
                  {note.name}
                </Typography>
                <Typography sx={{ 
                  fontSize: isMobile ? "12px" : "14px",
                  lineHeight: isMobile ? "1.4" : "1.6",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: isMobile ? 4 : 5,
                  WebkitBoxOrient: "vertical",
                  color: "#666",
                  flex: 1,
                }}>
                  {note.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1.5,
                  pt: 1,
                  borderTop: "1px solid #e0e0e0",
                  flexShrink: 0,
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "text.secondary",
                    fontSize: isMobile ? "11px" : "12px",
                  }}
                >
                  {note.date}
                </Typography>
                <Button
                  type="text"
                  size="small"
                  onClick={() => handleEditClick(note)}
                  style={{ minWidth: 0, padding: isMobile ? "2px" : "4px" }}
                  icon={<EditIcon fontSize="small" />}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Edit Modal */}
        <AntdModal
          open={editModalOpen}
          onCancel={() => setEditModalOpen(false)}
          footer={null}
          centered
          width={isMobile ? "90%" : isTablet ? 500 : 520}
          styles={{
            body: { 
              padding: isMobile ? "16px" : "24px" 
            }
          }}
        >
          <AntdTypography.Title 
            level={5} 
            style={{ 
              marginBottom: isMobile ? 12 : 16,
              fontSize: isMobile ? "16px" : "18px"
            }}
          >
            Edit Note
          </AntdTypography.Title>
          <Input
            placeholder="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ 
              marginBottom: isMobile ? 12 : 16,
              fontSize: isMobile ? "14px" : "inherit"
            }}
            size={isMobile ? "middle" : "large"}
          />
          <AntdTypography.Title 
            level={5} 
            style={{ 
              marginBottom: isMobile ? 12 : 16,
              fontSize: isMobile ? "16px" : "18px"
            }}
          >
            Description
          </AntdTypography.Title>
          <TextArea
            placeholder="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={isMobile ? 3 : 4}
            style={{ 
              marginBottom: isMobile ? 16 : 24,
              fontSize: isMobile ? "14px" : "inherit"
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            <div style={{ 
              display: "flex", 
              gap: 12, 
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row",
              width: isMobile ? "100%" : "auto"
            }}>
              <Button
                type="primary"
                onClick={handleEditSubmit}
                className="form-button"
                style={{
                  padding: isMobile ? "8px 24px" : "8px 32px",
                  background: blueAccent,
                  color: "#fff",
                  width: isMobile ? "100%" : "auto",
                  fontSize: isMobile ? "14px" : "inherit",
                }}
                loading={isLoading}
              >
                Save
              </Button>

              <MuiButton
                variant="outlined"
                color="error"
                onClick={() => setEditModalOpen(false)}
                className="form-button"
                sx={{
                  width: isMobile ? "100%" : "auto",
                  fontSize: isMobile ? "14px" : "inherit",
                }}
              >
                Cancel
              </MuiButton>
            </div>
            <MuiButton
              variant="outlined"
              color="error"
              onClick={handleDeleteNote}
              className="form-button"
              startIcon={<DeleteIcon />}
              sx={{
                width: isMobile ? "100%" : "auto",
                fontSize: isMobile ? "14px" : "inherit",
              }}
            >
              Delete
            </MuiButton>
          </div>
        </AntdModal>

        {/* Create Modal */}
        <AntdModal
          open={openModal}
          onCancel={handleCloseModal}
          footer={null}
          centered
          width={isMobile ? "90%" : isTablet ? 500 : 520}
          styles={{
            body: { 
              padding: isMobile ? "16px" : "24px" 
            }
          }}
        >
          <AntdTypography.Title 
            level={5} 
            style={{ 
              marginBottom: isMobile ? 10 : 7,
              fontSize: isMobile ? "16px" : "18px"
            }}
          >
            Enter Name
          </AntdTypography.Title>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ 
              marginBottom: isMobile ? 12 : 16,
              fontSize: isMobile ? "14px" : "inherit"
            }}
            size={isMobile ? "middle" : "large"}
          />
          <AntdTypography.Title 
            level={5} 
            style={{ 
              marginBottom: isMobile ? 10 : 7,
              fontSize: isMobile ? "16px" : "18px"
            }}
          >
            Description
          </AntdTypography.Title>
          <TextArea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={isMobile ? 3 : 4}
            style={{ 
              marginBottom: isMobile ? 16 : 24,
              fontSize: isMobile ? "14px" : "inherit"
            }}
          />
          <div style={{ 
            display: "flex", 
            gap: 12,
            flexDirection: isMobile ? "column" : "row",
          }}>
            <MuiButton
              variant="contained"
              onClick={handleSubmit}
              className="form-button"
              sx={{
                background: blueAccent,
                color: "#fff",
                width: isMobile ? "100%" : "auto",
                fontSize: isMobile ? "14px" : "inherit",
              }}
            >
              Submit
            </MuiButton>
            <MuiButton
              variant="outlined"
              color="error"
              onClick={handleCloseModal}
              className="form-button"
              sx={{
                width: isMobile ? "100%" : "auto",
                fontSize: isMobile ? "14px" : "inherit",
              }}
            >
              Cancel
            </MuiButton>
          </div>
        </AntdModal>
      </Box>
    </>
  );
};

export default NotesTab;

