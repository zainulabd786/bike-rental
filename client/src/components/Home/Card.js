import {Card, Button} from '@mui/material/';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';


export default function BikeCard({model, color, location, id, available, rating}) {
  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: available ? green[500] : '' }} aria-label="recipe">
            {id}
          </Avatar>
        }
        title={model}
        subheader={color}
      />
      <CardMedia
        component="img"
        height="194"
        image="/bike.webp"
        alt={model}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {location}
        </Typography>
      </CardContent>
      <CardActions className='justify-content-between' disableSpacing>
        <Typography>Rating: {rating}</Typography>
        <Button disabled={!available}>Book</Button> 
      </CardActions>
    </Card>
  );
}
