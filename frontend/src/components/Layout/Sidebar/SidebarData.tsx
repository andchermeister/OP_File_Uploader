import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export const SidebarData = [
  {
    title: "Home",
    icon: <HomeFilledIcon />,
    link: "/home",
  },
  {
    title: "My Files",
    icon: <InsertDriveFileIcon />,
    link: "/files",
  },
  {
    title: "My Folders",
    icon: <FolderIcon />,
    link: "/folders",
  },
];
