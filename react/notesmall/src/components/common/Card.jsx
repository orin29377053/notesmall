/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import LaunchIcon from '@mui/icons-material/Launch';
import noImg from "../../image/no_image.png";

export default function DocumentCard({ title, content, _id, image = "" }) {
    return (
        <Link
            to={`/${_id}`}
            css={css`
                text-decoration: none;
                
            `}
        >
            <Card
                sx={{ maxWidth: 345}}
                css={css`
                    margin: 10px 0;
                    border-radius: 5px;
                    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.2);
                    height: 300px;
                    
                    &:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 10px 20px -10px rgb(0 36 100 / 50%);
                    }
                `}
            >
                <CardMedia
                    sx={{ height: 140 }}
                    image={
                        image
                            ? image
                            : noImg
                    }
                    title="green iguana"
                />

                <CardContent>
                    <h4 className="singleLine">{title}</h4>
                    <Typography variant="body2" color="text.secondary" className="cardBody">
                        {content}
                    </Typography>
                </CardContent>
                <LaunchIcon  color="disabled" sx={{ margin: "10px" ,float: "right" }}/>
            </Card>
        </Link>
    );
}
