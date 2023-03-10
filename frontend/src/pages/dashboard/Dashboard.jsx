import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { Form } from "react-router-dom";
import { useState, useEffect } from "react";

// slider minimum for price ranges
const priceRangeSliderOpts = {
  minDistance: 10,
  max: 2000,
  min: 0,
}

const Dashboard = () => {
  const theme = useTheme();
  const [houseType, setHouseType] = useState("Any");
  const [showSublets, setShowSublets] = useState("Any");
  const [listingType, setListingType] = useState("Any");
  const [bedrooms, setBedrooms] = useState("Any");
  const [priceRange, setPriceRange] = useState([500, 1500]);
  const [lowPriceInput, setLowPrice] = useState(500);
  const [highPriceInput, setHighPrice] = useState(1500);

  useEffect(() => {
    if (lowPriceInput !== ""){
      setLowPrice(priceRange[0]);
    } 
    if (highPriceInput !== ""){
      setHighPrice(priceRange[1]);
    }
  }, [priceRange, lowPriceInput, highPriceInput]);


  const handleHouseType = (e) => {
    setHouseType(e.target.value);
  }

  const handleShowSublets = (e) => {
    setShowSublets(e.target.value);
  }

  const handleListingType = (e) => {
    setListingType(e.target.value);
  }

  const handleBedrooms = (e, bedroomNum) => {
    setBedrooms(bedroomNum);
  }

  const handlePriceRangeSlider = (e, newPriceRange, activeThumb) => {
    if (!Array.isArray(newPriceRange) || newPriceRange === "") {
      return;
    }

    if (newPriceRange[1] - newPriceRange[0] < priceRangeSliderOpts.minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newPriceRange[0], priceRangeSliderOpts.max - priceRangeSliderOpts.minDistance);
        setPriceRange([clamped, clamped + priceRangeSliderOpts.minDistance]);
      } else {
        const clamped = Math.max(newPriceRange[1], priceRangeSliderOpts.minDistance);
        setPriceRange([clamped - priceRangeSliderOpts.minDistance, clamped]);
      }
    } else {
      setPriceRange(newPriceRange);
    }
  }

  const handlePriceRangeInputMin = (e) => {
    if (e.target.value === ""){
      setLowPrice("");
    } else {
      setLowPrice(e.target.value);
      setPriceRange([Number(e.target.value), priceRange[1]]);
    }
  }

  const handlePriceRangeInputMax = (e) => {
    if (e.target.value === ""){
      setHighPrice("");
    }
    else {
      setHighPrice(e.target.value);
      setPriceRange([priceRange[0], Number(e.target.value)]);
    }
  }

  const handlePriceRangeBlur = () => {
    if (priceRange[1] - priceRange[0] < priceRangeSliderOpts.minDistance){
      setPriceRange([priceRange[0], priceRange[0] + priceRangeSliderOpts.minDistance]);
    } else if (priceRange[0] < priceRangeSliderOpts.min){
      setPriceRange([0, priceRange[1]]);
    } else if (priceRange[1] > priceRangeSliderOpts.max){
      setPriceRange([priceRange[0], priceRangeSliderOpts.max]);
    }
  }


  return(
      <Form action="post" style={{
        display: "flex",
        width: "inherit",
      }}>
          <Paper sx={{
            backgroundColor: theme.palette.grey[200],
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            flexGrow: 1,
            
            minWidth: "fit-content",
            marginX: "4em",
            height: "24rem",
            borderRadius: "12px",
          }}
          >
            {/** Header */}
            <Box id="content-header" sx={{  alignSelf: "center", justifyContent: "center", margin: 1 }}>
              <Typography variant="h4">
                Filters
              </Typography>
            </Box>
            <Divider sx={{ marginBottom: 0.5 }} />

            {/** Content */}
            <Box id="filter-content" sx={{ display: "flex", flexDirection: "column", flexGrow: 2, m: 1, overflow: "auto" }}>
            {/** House Type + Sublet */}
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              Property Options
            </Typography>
            <FormGroup row sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              {/** House Type */}
              <FormControl sx={{ m: 0.5, flexGrow: 1 }}>
                <InputLabel id="house-type-label">House Type</InputLabel>
                <Select
                  labelId="house-type-label"
                  id="house-type-select"
                  label="House Type"
                  value={houseType}
                  onChange={handleHouseType}
                >
                  <MenuItem value={"Any"}>Any</MenuItem>
                  <MenuItem value={"House"}>House</MenuItem>
                  <MenuItem value={"Shared House"}>Shared House</MenuItem>
                  <MenuItem value={"Apartment/Condo"}>Apartment/Condo</MenuItem>
                  <MenuItem value={"Shared Apartment/Condo"}>Shared Apartment/Condo</MenuItem>
                  <MenuItem value={"Bachelor Apartment"}>Bachelor Apartment</MenuItem>
                </Select>
              </FormControl>   
              {/** Listing Type */}
              <FormControl sx={{  flexGrow: 1, m:0.5, marginTop: 2 }}>
                <InputLabel id="listing-type-label">Listing Type</InputLabel>
                <Select
                  labelId="listing-type-label"
                  id="listing-type-select"
                  label="Listing Type"
                  value={listingType}
                  onChange={handleListingType}
                >
                  <MenuItem value={"Any"}>Any</MenuItem>
                  <MenuItem value={"Offering"}>Offering</MenuItem>
                  <MenuItem value={"Wanted"}>Wanted</MenuItem>
                </Select>
              </FormControl>
              {/** Sublet */}
              <FormControl sx={{flexGrow: 1, m:0.5, marginTop: 2 }}>
                <InputLabel id="sublet-label">Show Sublets?</InputLabel>
                <Select
                  labelId="sublet-label"
                  id="sublet-select"
                  label="Show Sublets?"
                  value={showSublets}
                  onChange={handleShowSublets}
                >
                  <MenuItem value={"Any"}>Any</MenuItem>
                  <MenuItem value={"Offering"}>Yes</MenuItem>
                  <MenuItem value={"Wanted"}>No</MenuItem>
                </Select>
              </FormControl>

              
              {/* <FormControlLabel sx={{ flexGrow: 1, minWidth: 80, justifyContent: "end", m: 1 }} value="Sublet" labelPlacement="start" control={<Switch id="sublet-switch" checked={sublet} value={sublet} onChange={handleSublet} />} label="Sublet" /> */}
            </FormGroup>
            <Divider sx={{ marginY: 2, marginX: 1 }}/>
            {/** Bedrooms */}
            <Typography variant="h6">
              Bedrooms
            </Typography>
            
            <FormGroup row sx={{
              display: "flex",
              justifyContent: "start",
              flexBasis: "50%",
            }}>
              <ToggleButtonGroup
                color="primary"
                value={bedrooms}
                exclusive={true}
                onChange={handleBedrooms}
                aria-label="Bedrooms"
                sx={{
                  flexBasis: "100%",
                  flexWrap: "wrap",
                  display: "flex",
                  overflowX: "auto",
                }}
              >
                <ToggleButton value={"Any"}>Any</ToggleButton>
                <ToggleButton value={"1"}>1</ToggleButton>
                <ToggleButton value={"2"}>2</ToggleButton>
                <ToggleButton value={"3"}>3</ToggleButton>
                <ToggleButton value={"4"}>4</ToggleButton>
                <ToggleButton value={"5"}>5</ToggleButton>
                <ToggleButton value={"6"}>6</ToggleButton>
                <ToggleButton value={"7"}>7</ToggleButton>
                <ToggleButton value={"8+"}>8+</ToggleButton>
              </ToggleButtonGroup>
              
              {/* <IconButton sx={{ display: "block" }} onClick={handleOpenHelpBedrooms} aria-label="More Information">
                <HelpOutlinedIcon />
              </IconButton>
              <Dialog
                open={openHelpBed}
                onClose={handleCloseHelpBedrooms}
              >
                <DialogTitle>
                  {"Webhook Bedrooms Information"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enabling bedrooms gives you the opportunity to select how many bedrooms
                    you would like to appear in your webhook. Disabling bedrooms means you would like to
                    receive listings regardless of the number of bedrooms.
                  </DialogContentText>
                </DialogContent>
              </Dialog> */}
            </FormGroup>
            <Divider sx={{ marginY: 2, marginX: 1 }}/>
            {/** Price Range */}
            <Box id="price-range">
              <Typography variant="h6">
                Price Range
              </Typography>
              <FormGroup row sx={{ 
                display: "flex",
                justifyContent: "center",
                margin: "auto",
               }}> 
                <Stack spacing={2} sx={{ 
                  flexBasis: "80%",
                  display: "flex",
                  justifyContent: "center"
                 }}>
                <Slider 
                  getAriaLabel={() => "Price Range"}
                  value={priceRange}
                  onChange={handlePriceRangeSlider}
                  valueLabelDisplay="auto"
                  disableSwap
                  size="medium"
                  max={priceRangeSliderOpts.max}
                  min={priceRangeSliderOpts.min}
                  sx={{ flexBasis: "80%", flexGrow: 0, alignSelf: "center"}}
                />
              <Box sx={{ 
                  display: "flex",
                  justifyContent: "space-around",
                 }}>
                   <OutlinedInput 
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    value={lowPriceInput}
                    size="small"
                    onChange={handlePriceRangeInputMin}
                    onBlur={handlePriceRangeBlur}
                    inputProps={{
                      step: priceRangeSliderOpts.minDistance,
                      min: priceRangeSliderOpts.min,
                      max: priceRangeSliderOpts.max,
                      type: "number"
                    }}
                    sx={{ flexGrow: 1 }}
                   />
                   <Typography variant="subtitle" sx={{ alignSelf: "center", m: 2 }}>
                    ━
                   </Typography>
                   <OutlinedInput 
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    value={highPriceInput}
                    size="small"
                    onChange={handlePriceRangeInputMax}
                    onBlur={handlePriceRangeBlur}
                    inputProps={{
                      step: priceRangeSliderOpts.minDistance,
                      min: priceRangeSliderOpts.min,
                      max: priceRangeSliderOpts.max,
                      type: "number"
                    }}
                    sx={{ flexGrow: 1 }}
                   />
                </Box>
                </Stack>
              </FormGroup>
            </Box>

            {/** Available Date */}
            <Divider sx={{ marginY: 2, marginX: 1 }}/>
            <Box id="available-date">
              <Typography variant="h6">
                Available Date
              </Typography>
              <FormGroup row sx={{
                display: "flex",
                justifyContent: "start",
              }}>
                
              </FormGroup>
            </Box>
            {/** Amenities */}
            <Divider sx={{ marginY: 2, marginX: 1 }}/>
            <Box id="amenities">
              <Typography variant="h6">
                Amenities
              </Typography>
              <FormGroup row sx={{
                display: "flex",
                justifyContent: "start",
              }}>
                
              </FormGroup>
            </Box>

            </Box>{/** End of Content */}
            
            {/** Footer */}
            <Box sx={{ 
                display: "flex",
                justifyContent: "center",
             }}>
              <Button sx={{ borderRadius: "0px 0px 12px 12px", flexGrow: 0, width: "100%", height: 40, alignSelf: "center", m: 0 }} type="submit" variant="contained">
                  Create  
              </Button>
            </Box>
          </Paper>
        </Form>
  );
}

export default Dashboard;