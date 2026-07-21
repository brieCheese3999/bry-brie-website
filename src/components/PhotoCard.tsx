// src/components/CustomCard.tsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface WACCardProps {
    title: string;
    description: string;
    image: string;
}

const CustomCard: React.FC<WACCardProps> = ({ title, description, image }) => {
    return (
        <Card sx={{ maxWidth: 345, margin: '20px', boxShadow: 3 }}>
            <CardMedia
                component="img"
                height="140"
                image={image}
                alt={title}
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CustomCard;
