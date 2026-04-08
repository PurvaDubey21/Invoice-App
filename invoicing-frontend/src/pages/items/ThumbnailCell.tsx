import { Avatar } from "@mui/material";
import { useGetItemThumbnailQuery } from "../../services/itemApiRtk";

interface Props {
  itemID: number;
}

const ThumbnailCell = ({ itemID }: Props) => {
  const { data: thumbnailUrl } = useGetItemThumbnailQuery(itemID);
  
  return (
    <Avatar
      variant="rounded"
      src={thumbnailUrl || undefined}
      sx={{ width: 55, height: 55, bgcolor: "#f0f0f0" }}
    />
  );
};

export default ThumbnailCell;
