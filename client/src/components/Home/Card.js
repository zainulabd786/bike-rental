import { Card, Button } from '@mui/material/';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';
import { Rating } from 'components/Shared';


export default function BikeCard({
  model,
  color,
  location,
  id,
  available,
  handleBookClick
}) {
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
        <Rating bikeId={id} />
        <Button onClick={() => handleBookClick(id)} disabled={!available}>Book</Button>
      </CardActions>
    </Card>
  );
}
