// City/State → [lat, lng] coordinates for all project locations
// Used by the map view to place markers.
// Coordinates are approximate city-center; pins aren't exact site locations.

export const COORDS: Record<string, [number, number]> = {
  // Texas
  "Abilene,TX": [32.45, -99.73],
  "Albany,TX": [32.6667, -99.3167],
  "Abernathy,TX": [33.6759, -101.7368],
  "Brownsville,TX": [25.9017, -97.4975],
  "Cameron,TX": [30.8488, -96.9783],
  "Childress,TX": [34.5928, -100.2073],
  "Claude,TX": [34.9639, -101.3527],
  "Colorado City,TX": [32.3976, -100.8629],
  "Corpus Christi,TX": [27.8006, -97.3964],
  "Dickens,TX": [33.6212, -100.7754],
  "Ellendale,ND": [46.0039, -98.5245],
  "Fairfield,TX": [31.8104, -96.1597],
  "Fort Stockton,TX": [30.8891, -102.8793],
  "Lancaster,TX": [32.5924, -96.7564],
  "Lufkin,TX": [31.3382, -94.7233],
  "Meridian,TX": [31.9238, -97.6553],
  "Odessa,TX": [31.8456, -102.3676],
  "Pecos,TX": [31.4224, -103.4932],
  "Point Pleasant,WV": [38.8454, -82.1232],
  "Rockdale,TX": [30.6546, -97.0672],
  "San Angelo,TX": [31.4249, -100.4542],
  "San Antonio,TX": [29.4241, -98.4936],
  "San Marcos,TX": [29.8833, -97.9414],
  "Sherman,TX": [33.6607, -96.6136],
  "Sierra Blanca,TX": [31.1754, -105.3586],
  "Sweetwater,TX": [32.4707, -100.4048],
  "Taylor,TX": [30.5746, -97.4216],
  "Temple,TX": [31.0982, -97.3428],
  "Lockhart,TX": [29.8862, -97.6706],
  "Roby,TX": [32.9135, -100.7698],
  "Lytle,TX": [29.1975, -98.9989],
  "Tolar,TX": [32.3893, -97.9922],
  "Holly Ridge,LA": [32.8685, -91.6282],

  // Virginia
  "Ashland,VA": [37.5246, -77.4758],
  "Ashburn,VA": [39.4146, -77.4249],
  "Stafford,VA": [38.4226, -77.4089],
  "Manassas,VA": [38.7515, -77.4755],
  "Louisa,VA": [37.5246, -77.5408],
  "Fredericksburg,VA": [38.3032, -77.4605],
  "Appomattox,VA": [37.3576, -78.8239],
  "Culpeper,VA": [38.4115, -77.9995],
  "Goochland,VA": [37.0696, -77.5908],
  "Hanover,VA": [37.5246, -77.4758],
  "Chesterfield,VA": [37.4246, -77.5899],
  "Chester,VA": [37.3619, -77.4408],
  "Sandston,VA": [37.5232, -77.2658],

  // Georgia
  "Springfield,GA": [32.4485, -81.3137],
  "Bolingbroke,GA": [33.1454, -83.7357],
  "Newnan,GA": [33.3762, -84.7994],
  "Marietta,GA": [33.9526, -84.5499],
  "Union City,GA": [33.5882, -84.5257],
  "Conyers,GA": [33.6677, -84.0167],
  "Lithia Springs,GA": [33.7904, -84.7594],
  "Douglasville,GA": [33.7515, -84.7477],
  "Fayetteville,GA": [33.4485, -84.4588],
  "Palmetto,GA": [33.5246, -84.6677],
  "Cartersville,GA": [34.1651, -84.7994],
  "Henderson,NC": [36.3296, -78.5995],
  "Moncure,NC": [35.6354, -79.1175],
  "Enfield,NC": [36.1816, -77.6697],
  "Apex,NC": [35.7327, -78.7475],
  "Charlotte,NC": [35.2271, -80.8431],
  "Madison,NC": [36.2989, -80.1087],
  "Yadkinville,NC": [36.1307, -80.6659],
  "Statesville,NC": [35.7826, -80.8873],
  "Fayetteville,NC": [35.0527, -78.8784],

  // Louisiana
  "Boyce,LA": [31.3896, -92.6656],
  "St. Francisville,LA": [30.7591, -91.3862],

  // Ohio
  "Piketon,OH": [39.0723, -83.0141],
  "New Albany,OH": [40.0809, -82.8157],
  "Johnstown,OH": [40.2728, -82.6807],
  "Canton,OH": [40.7996, -81.3784],

  // Indiana
  "New Carlisle,IN": [41.4164, -86.5095],
  "Lebanon,IN": [40.0484, -86.4672],
  "Indianapolis,IN": [39.7684, -86.1581],
  "Fort Wayne,IN": [41.0793, -85.1394],
  "Monrovia,IN": [39.5681, -86.4764],

  // Wyoming
  "Cheyenne,WY": [41.14, -104.8202],
  "Evanston,WY": [41.2683, -110.9636],
  "Casper,WY": [42.8666, -106.3131],

  // Pennsylvania
  "Shippingport,PA": [40.8656, -80.2834],
  "Salem Township,PA": [40.5834, -76.5639],
  "Carlisle,PA": [40.2014, -77.1961],
  "Lancaster,PA": [40.0379, -76.3055],
  "Homer City,PA": [40.5395, -79.1553],

  // West Virginia
  "Thomas,WV": [39.1384, -79.4953],

  // Illinois
  "Joliet,IL": [41.525, -88.0817],
  "Morris,IL": [41.3456, -88.4237],
  "Yorkville,IL": [41.5858, -88.4487],
  "Grayslake,IL": [42.3453, -88.0406],
  "Mount Prospect,IL": [42.0664, -87.9342],
  "Hoffman Estates,IL": [42.0428, -88.0798],
  "Latham,IL": [39.6906, -89.6165],
  "Waverly,IL": [39.5906, -89.9587],

  // Michigan
  "Saline,MI": [42.1662, -83.7816],
  "Van Buren Township,MI": [42.1662, -83.4828],
  "Holt,MI": [42.6406, -84.5156],

  // Wisconsin
  "Mount Pleasant,WI": [42.7686, -87.8495],
  "Beaver Dam,WI": [43.4578, -88.8385],
  "Janesville,WI": [42.6817, -89.0187],

  // Arizona
  "Mesa,AZ": [33.4152, -111.8315],
  "Goodyear,AZ": [33.4354, -112.3586],
  "Phoenix,AZ": [33.4484, -112.0740],
  "El Mirage,AZ": [33.6256, -112.3356],
  "Avondale,AZ": [33.4484, -112.3484],

  // North Dakota
  "Harwood,ND": [46.9406, -96.8768],

  // New Mexico
  "Santa Teresa,NM": [31.8656, -106.6456],

  // Oklahoma
  "Alva,OK": [36.8056, -98.6656],

  // Kansas
  "Canton,KS": [37.4246, -97.4246],

  // Minnesota
  "Becker,MN": [45.6406, -93.8768],
  "Farmington,MN": [44.6406, -93.0456],
  "Rosemount,MN": [44.7406, -93.1256],

  // Missouri
  "Kansas City,MO": [39.0997, -94.5786],
  "Festus,MO": [38.2206, -90.5956],
  "Pacific,MO": [38.4826, -90.7406],
  "Villa Ridge,MO": [38.4756, -90.0456],

  // New York
  "Somerset,NY": [43.0456, -78.8456],
  "Massena,NY": [44.9276, -74.8956],
  "Ilion,NY": [43.0456, -75.0456],
  "Yaphank,NY": [40.8356, -72.9156],
  "Lysander,NY": [43.1356, -76.3456],
  "Tonawanda,NY": [42.8756, -78.8656],
  "Albany,NY": [42.6656, -73.7990],

  // Kentucky
  "Paducah,KY": [37.0834, -88.6006],
  "Eastern Kentucky,KY": [37.5, -83.5],

  // Alabama
  "Hayneville,AL": [32.1854, -86.5756],
  "Bessemer,AL": [33.0, -86.9456],
  "Brookwood,AL": [33.2456, -87.3256],

  // Tennessee
  "Memphis,TN": [35.1495, -90.0490],
  "Nashville,TN": [36.1627, -86.7816],

  // Colorado
  "Windsor,CO": [40.5023, -104.7386],

  // Utah
  "McCornick,UT": [39.3456, -112.3456],
  "Tooele County,UT": [40.5023, -112.3473],
  "Box Elder County,UT": [41.0, -113.0],

  // Florida
  "Fort Meade,FL": [27.7516, -81.4356],
  "Fort Pierce,FL": [27.4467, -80.3256],

  // South Carolina
  "Walterboro,SC": [33.0456, -80.6656],

  // Idaho
  "Burley,ID": [42.5456, -113.7956],

  // Mississippi
  "Canton,MS": [32.6135, -90.0310],

  // Oregon
  "Salem,OR": [44.9429, -123.0351],

  // California
  "Taft,CA": [35.1426, -119.4356],
  "Imperial,CA": [32.8486, -115.5686],

  // Maryland
  "Adamstown,MD": [39.3456, -77.3756],
  "Landover,MD": [38.9356, -76.8956],
  "Lusby,MD": [38.3556, -76.4356],

  // Nevada
  "Storey County,NV": [39.5, -119.0],

  // Washington
  // (no WA cities yet)
};

export function getCoords(city: string, state: string): [number, number] | null {
  const key = `${city},${state}`;
  return COORDS[key] ?? null;
}