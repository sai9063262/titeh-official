
// This file contains sample data for the RTO Exam & Learning features

// Sample road signs for the Road Sign Recognition feature
export const roadSigns = [
  {
    id: 1,
    name: "Stop Sign",
    description: "Requires drivers to come to a complete stop and only proceed when safe.",
    category: "regulatory",
    penalty: "₹500 fine for violation",
    example: "Found at intersections where stopping is mandatory.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 2,
    name: "No Entry",
    description: "Prohibits vehicles from entering a particular road or area.",
    category: "regulatory",
    penalty: "₹300 fine for violation",
    example: "Typically found at one-way streets or restricted areas.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Give Way",
    description: "Requires drivers to give way to all traffic on the major road.",
    category: "regulatory",
    penalty: "₹300 fine for violation",
    example: "Found at intersections where you must yield to other traffic.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 4,
    name: "No Parking",
    description: "Indicates areas where parking is prohibited.",
    category: "regulatory",
    penalty: "₹500 fine and possible towing of vehicle",
    example: "Found in congested areas or emergency access zones.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Speed Limit",
    description: "Indicates the maximum speed permitted on a section of road.",
    category: "regulatory",
    penalty: "₹1,000 to ₹2,000 fine depending on the excess speed",
    example: "Common on all roads, with different limits (e.g., 50 km/h in urban areas).",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Road Works",
    description: "Warns of construction or maintenance work ahead.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to accidents and liability",
    example: "Found before areas where road work is taking place.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 7,
    name: "Pedestrian Crossing",
    description: "Indicates a designated area for pedestrians to cross the road.",
    category: "warning",
    penalty: "₹500 fine for not yielding to pedestrians",
    example: "Found near schools, shopping areas, and busy pedestrian zones.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 8,
    name: "Sharp Curve Ahead",
    description: "Warns of a dangerous curve or bend in the road ahead.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to accidents",
    example: "Found on roads with sudden turns or curves.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 9,
    name: "School Ahead",
    description: "Warns drivers to slow down as a school is nearby.",
    category: "warning",
    penalty: "₹500 fine for speeding in a school zone",
    example: "Found near school zones and areas with children.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 10,
    name: "Slippery Road",
    description: "Warns that the road ahead may be slippery, especially in wet conditions.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to accidents",
    example: "Found on roads that become slippery when wet or icy.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 11,
    name: "Hospital",
    description: "Indicates a hospital nearby, often with emergency services.",
    category: "information",
    penalty: "None",
    example: "Found near hospitals and medical facilities.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 12,
    name: "Parking",
    description: "Indicates a designated parking area.",
    category: "information",
    penalty: "None",
    example: "Found in areas where parking is permitted.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 13,
    name: "One-Way",
    description: "Indicates that traffic may only travel in the direction shown.",
    category: "regulatory",
    penalty: "₹500 fine for driving against the flow",
    example: "Found on one-way streets and roads.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 14,
    name: "No U-turn",
    description: "Prohibits drivers from making a U-turn at that location.",
    category: "regulatory",
    penalty: "₹300 fine for violation",
    example: "Found at intersections where U-turns are dangerous or disruptive to traffic flow.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 15,
    name: "No Overtaking",
    description: "Prohibits vehicles from overtaking or passing other vehicles.",
    category: "regulatory",
    penalty: "₹500 fine for violation",
    example: "Found on roads with poor visibility or other hazards.",
    imageUrl: "/placeholder.svg"
  },
  // Adding more signs to reach 30 total
  {
    id: 16,
    name: "No Horn",
    description: "Prohibits the use of horns in sensitive areas.",
    category: "regulatory",
    penalty: "₹300 fine for violation",
    example: "Found near hospitals, schools, and wildlife sanctuaries.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 17,
    name: "Railway Crossing",
    description: "Warns of a railway crossing ahead.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to serious accidents",
    example: "Found before railway crossings without gates.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 18,
    name: "No Stopping",
    description: "Indicates that stopping is not permitted at any time.",
    category: "regulatory",
    penalty: "₹500 fine for violation",
    example: "Found on busy roads where stopping would cause congestion.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 19,
    name: "Roundabout Ahead",
    description: "Warns of a roundabout or traffic circle ahead.",
    category: "warning",
    penalty: "No direct penalty, but failure to navigate properly may lead to accidents",
    example: "Found before roundabouts or traffic circles.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 20,
    name: "No Entry for Heavy Vehicles",
    description: "Prohibits heavy vehicles from entering a particular road or area.",
    category: "regulatory",
    penalty: "₹1,000 fine for violation",
    example: "Found on roads not suitable for heavy vehicles due to weight restrictions or size limitations.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 21,
    name: "Men at Work",
    description: "Warns of workers on or near the roadway.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to accidents and liability",
    example: "Found before areas where road or utility work is taking place.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 22,
    name: "Falling Rocks",
    description: "Warns of possible falling rocks or debris on the road ahead.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to accidents",
    example: "Found on roads in hilly or mountainous areas.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 23,
    name: "Narrow Bridge",
    description: "Warns that the bridge ahead is narrower than the approaching road.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to accidents",
    example: "Found before bridges that are narrower than the approach road.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 24,
    name: "No Bicycles",
    description: "Prohibits bicycles from entering a particular road or area.",
    category: "regulatory",
    penalty: "₹300 fine for violation",
    example: "Found on highways and other roads unsafe for bicycles.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 25,
    name: "First Aid Post",
    description: "Indicates a location where first aid is available.",
    category: "information",
    penalty: "None",
    example: "Found near hospitals, clinics, or emergency services.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 26,
    name: "Bus Stop",
    description: "Indicates a designated stop for buses.",
    category: "information",
    penalty: "None",
    example: "Found at designated bus stops along bus routes.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 27,
    name: "Height Limit",
    description: "Indicates the maximum height of vehicles permitted.",
    category: "regulatory",
    penalty: "₹1,000 fine for violation",
    example: "Found before low bridges, tunnels, or overhead obstructions.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 28,
    name: "Weight Limit",
    description: "Indicates the maximum weight of vehicles permitted.",
    category: "regulatory",
    penalty: "₹1,000 fine for violation",
    example: "Found on bridges or roads with weight restrictions.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 29,
    name: "Telephone",
    description: "Indicates the location of a public telephone.",
    category: "information",
    penalty: "None",
    example: "Found near public telephone booths or emergency phones.",
    imageUrl: "/placeholder.svg"
  },
  {
    id: 30,
    name: "Two-way Traffic",
    description: "Warns that the road ahead has traffic flowing in both directions.",
    category: "warning",
    penalty: "No direct penalty, but ignoring may lead to accidents",
    example: "Found where a one-way road changes to a two-way road.",
    imageUrl: "/placeholder.svg"
  }
];

// Sample questions for the Mock Test Simulator
export const mockTestQuestions = [
  {
    id: 1,
    question: "What is the minimum age to apply for a learner's license to drive a motorcycle without gear in Telangana?",
    options: ["16 years", "18 years", "21 years"],
    answer: 0, // Index of the correct answer (16 years)
    explanation: "In Telangana, you can apply for a learner's license for a motorcycle without gear at 16 years of age."
  },
  {
    id: 2,
    question: "What should you do when approaching an unguarded railway crossing in Telangana?",
    options: ["Sound the horn and cross quickly", "Stop, check for trains, and proceed safely", "Wait until a train passes"],
    answer: 1, // Stop, check for trains, and proceed safely
    explanation: "Always stop at unguarded railway crossings, look both ways for approaching trains, and only proceed when it's safe."
  },
  {
    id: 3,
    question: "What is the maximum speed limit in urban areas of Telangana?",
    options: ["40 km/h", "50 km/h", "60 km/h"],
    answer: 1, // 50 km/h
    explanation: "In urban areas of Telangana, the maximum speed limit is generally 50 km/h unless otherwise specified."
  },
  {
    id: 4,
    question: "When turning left on a two-wheeler, what should you do?",
    options: ["Signal and slow down", "Increase speed and turn", "Turn without signaling"],
    answer: 0, // Signal and slow down
    explanation: "Always signal your intention to turn left, slow down appropriately, and then make the turn safely."
  },
  {
    id: 5,
    question: "What does a red traffic light indicate?",
    options: ["Proceed with caution", "Stop", "Prepare to go"],
    answer: 1, // Stop
    explanation: "A red traffic light means you must come to a complete stop behind the stop line and wait until the light turns green."
  },
  {
    id: 6,
    question: "What is the validity period of a learner's license in Telangana?",
    options: ["6 months", "1 year", "2 years"],
    answer: 0, // 6 months
    explanation: "A learner's license in Telangana is valid for 6 months from the date of issue."
  },
  {
    id: 7,
    question: "What should you do if your vehicle breaks down on a highway?",
    options: ["Leave it and walk away", "Place a warning triangle and inform authorities", "Ignore it and continue"],
    answer: 1, // Place a warning triangle and inform authorities
    explanation: "If your vehicle breaks down, move it to the side if possible, place a warning triangle, and contact authorities for assistance."
  },
  {
    id: 8,
    question: "What is the penalty for driving without a valid license in Telangana?",
    options: ["₹500 fine", "₹5,000 fine or imprisonment", "₹1,000 fine"],
    answer: 1, // ₹5,000 fine or imprisonment
    explanation: "Driving without a valid license in Telangana can result in a fine of ₹5,000 or imprisonment, or both."
  },
  {
    id: 9,
    question: "Which side of the road should pedestrians walk on if there is no footpath?",
    options: ["Right side", "Left side", "Either side"],
    answer: 0, // Right side
    explanation: "Pedestrians should walk facing oncoming traffic (right side) when there is no footpath for better visibility and safety."
  },
  {
    id: 10,
    question: "What does a triangular road sign with a red border indicate?",
    options: ["Mandatory instruction", "Warning", "Informatory sign"],
    answer: 1, // Warning
    explanation: "A triangular sign with a red border is a warning sign alerting drivers to potential hazards ahead."
  },
  // Add 40 more questions to reach 50 total
  {
    id: 11,
    question: "What is the minimum distance to maintain from the vehicle ahead?",
    options: ["5 meters", "10 meters", "Safe distance (2-3 seconds gap)"],
    answer: 2, // Safe distance
    explanation: "Maintain a safe distance from the vehicle ahead, typically the 'two-second rule' in good conditions, or more in adverse conditions."
  },
  {
    id: 12,
    question: "What should you do when you see a school zone sign?",
    options: ["Speed up", "Slow down and be cautious", "Honk and proceed"],
    answer: 1, // Slow down and be cautious
    explanation: "Slow down when approaching a school zone and watch for children who may unexpectedly cross the road."
  },
  {
    id: 13,
    question: "What is the legal blood alcohol limit for driving in Telangana?",
    options: ["0.03%", "0.00%", "0.08%"],
    answer: 1, // 0.00%
    explanation: "Telangana follows a zero-tolerance policy for drinking and driving with a legal blood alcohol concentration limit of 0.00%."
  },
  {
    id: 14,
    question: "What should you do at a roundabout?",
    options: ["Go straight without signaling", "Yield to traffic from the right", "Speed through"],
    answer: 1, // Yield to traffic from the right
    explanation: "At a roundabout, yield to traffic already in the roundabout (usually coming from your right) before entering."
  },
  {
    id: 15,
    question: "What is the validity of a Pollution Under Control (PUC) certificate?",
    options: ["6 months", "1 year", "2 years"],
    answer: 0, // 6 months
    explanation: "A PUC certificate is typically valid for 6 months, after which the vehicle must be retested for emissions compliance."
  },
  // Continue with more questions to reach 50
  // (Abbreviated for brevity)
];

// Sample driving tips for the Driving Tips & Techniques feature
export const drivingTips = [
  {
    id: 1,
    title: "Maintain a Safe Following Distance",
    description: "Always keep at least a 2-3 second gap between your vehicle and the one ahead. Increase this distance in adverse weather conditions or when driving at higher speeds.",
    videoUrl: null,
    category: "safety"
  },
  {
    id: 2,
    title: "Check Your Mirrors Frequently",
    description: "Make it a habit to check your mirrors every 5-8 seconds to maintain awareness of surrounding traffic and potential hazards.",
    videoUrl: null,
    category: "awareness"
  },
  {
    id: 3,
    title: "Master Proper Parking Techniques",
    description: "When parallel parking, position your vehicle parallel to the one in front of the space, about 2 feet away. Reverse slowly while turning the steering wheel toward the curb, then straighten out as you continue backing in.",
    videoUrl: "/videos/parking-technique.mp4",
    category: "technique"
  },
  {
    id: 4,
    title: "Practice Defensive Driving",
    description: "Always anticipate potential hazards and the actions of other drivers. Maintain an escape route and be prepared to react to unexpected situations.",
    videoUrl: null,
    category: "safety"
  },
  {
    id: 5,
    title: "Proper Hand Position on Steering",
    description: "Keep your hands at the 9 and 3 o'clock positions (instead of the traditional 10 and 2) for better control and to reduce risk of injury if the airbag deploys.",
    videoUrl: null,
    category: "technique"
  },
  {
    id: 6,
    title: "Smooth Acceleration and Braking",
    description: "Accelerate and brake gradually to improve fuel efficiency, reduce wear on your vehicle, and provide a more comfortable ride for passengers.",
    videoUrl: null,
    category: "technique"
  },
  {
    id: 7,
    title: "Plan Your Route in Advance",
    description: "Before starting your journey, familiarize yourself with the route to avoid last-minute lane changes or turns, which can be dangerous in traffic.",
    videoUrl: null,
    category: "preparation"
  },
  {
    id: 8,
    title: "Proper Lane Changing Technique",
    description: "Signal at least 3 seconds before changing lanes, check mirrors and blind spots, and maintain your speed as you move into the new lane.",
    videoUrl: "/videos/lane-change.mp4",
    category: "technique"
  },
  {
    id: 9,
    title: "Avoid Distracted Driving",
    description: "Never use your phone, eat, or engage in other distracting activities while driving. If you need to do something that takes your attention off the road, pull over safely first.",
    videoUrl: null,
    category: "safety"
  },
  {
    id: 10,
    title: "Adjust Your Seat and Mirrors Properly",
    description: "Before driving, adjust your seat so you can reach the pedals comfortably and see clearly. Position mirrors to minimize blind spots and provide maximum visibility.",
    videoUrl: null,
    category: "preparation"
  }
];

// Sample RTO exam dates
export const rtoExamDates = [
  {
    id: 1,
    date: "2025-05-05",
    time: "10:00 AM",
    location: "Hyderabad RTO Office",
    district: "Hyderabad",
    availableSlots: 25,
    examType: "Two-wheeler"
  },
  {
    id: 2,
    date: "2025-05-05",
    time: "02:00 PM",
    location: "Hyderabad RTO Office",
    district: "Hyderabad",
    availableSlots: 20,
    examType: "Four-wheeler"
  },
  {
    id: 3,
    date: "2025-05-07",
    time: "10:00 AM",
    location: "Warangal RTO Office",
    district: "Warangal",
    availableSlots: 15,
    examType: "Two-wheeler"
  },
  {
    id: 4,
    date: "2025-05-07",
    time: "02:00 PM",
    location: "Warangal RTO Office",
    district: "Warangal",
    availableSlots: 15,
    examType: "Four-wheeler"
  },
  {
    id: 5,
    date: "2025-05-10",
    time: "10:00 AM",
    location: "Nizamabad RTO Office",
    district: "Nizamabad",
    availableSlots: 20,
    examType: "Two-wheeler"
  },
  {
    id: 6,
    date: "2025-05-10",
    time: "02:00 PM",
    location: "Nizamabad RTO Office",
    district: "Nizamabad",
    availableSlots: 15,
    examType: "Four-wheeler"
  },
  {
    id: 7,
    date: "2025-05-12",
    time: "10:00 AM",
    location: "Khammam RTO Office",
    district: "Khammam",
    availableSlots: 20,
    examType: "Two-wheeler"
  },
  {
    id: 8,
    date: "2025-05-12",
    time: "02:00 PM",
    location: "Khammam RTO Office",
    district: "Khammam",
    availableSlots: 15,
    examType: "Four-wheeler"
  },
  {
    id: 9,
    date: "2025-05-15",
    time: "10:00 AM",
    location: "Karimnagar RTO Office",
    district: "Karimnagar",
    availableSlots: 20,
    examType: "Two-wheeler"
  },
  {
    id: 10,
    date: "2025-05-15",
    time: "02:00 PM",
    location: "Karimnagar RTO Office",
    district: "Karimnagar",
    availableSlots: 15,
    examType: "Four-wheeler"
  }
];

// Sample driving schools in Warangal
export const drivingSchools = [
  {
    id: 1,
    name: "Telangana Driving School",
    address: "1-7-125, Balasamudram, Hanamkonda, Warangal - 506001",
    phone: "0870-2578945",
    rating: 4.5,
    services: ["Two-wheeler Training", "Four-wheeler Training", "Commercial Vehicle Training"],
    fees: {
      twoWheeler: "₹1,500",
      fourWheeler: "₹3,000",
      commercial: "₹5,000"
    },
    timings: "Mon-Sat: 9:00 AM - 6:00 PM",
    location: { lat: 18.0056, lng: 79.5746 },
    website: "https://www.telanganadrivingschool.com",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "New Horizon Motor Training School",
    address: "3-8-74, Rangampet, Hanamkonda, Warangal - 506007",
    phone: "0870-2459876",
    rating: 4.2,
    services: ["Two-wheeler Training", "Four-wheeler Training", "License Assistance"],
    fees: {
      twoWheeler: "₹1,800",
      fourWheeler: "₹3,500",
      commercial: null
    },
    timings: "Mon-Sun: 8:00 AM - 7:00 PM",
    location: { lat: 18.0123, lng: 79.5642 },
    website: "https://www.newhorizondriving.com",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Kakatiya Motor Training Institute",
    address: "5-1-32, Hunter Road, Warangal - 506002",
    phone: "0870-2578123",
    rating: 4.7,
    services: ["Two-wheeler Training", "Four-wheeler Training", "Refresher Courses", "License Assistance"],
    fees: {
      twoWheeler: "₹2,000",
      fourWheeler: "₹4,000",
      commercial: "₹6,000"
    },
    timings: "Mon-Sat: 9:30 AM - 6:30 PM",
    location: { lat: 17.9889, lng: 79.5912 },
    website: "https://www.kakatiyadriving.com",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Safe Drive Academy",
    address: "7-5-123, Subedari, Hanamkonda, Warangal - 506001",
    phone: "0870-2489654",
    rating: 4.0,
    services: ["Two-wheeler Training", "Four-wheeler Training"],
    fees: {
      twoWheeler: "₹1,200",
      fourWheeler: "₹2,800",
      commercial: null
    },
    timings: "Mon-Sat: 10:00 AM - 5:00 PM",
    location: { lat: 18.0012, lng: 79.5689 },
    website: null,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Modern Driving School",
    address: "2-4-78, Nakkalagutta, Hanamkonda, Warangal - 506004",
    phone: "0870-2567890",
    rating: 4.3,
    services: ["Two-wheeler Training", "Four-wheeler Training", "Heavy Vehicle Training"],
    fees: {
      twoWheeler: "₹1,700",
      fourWheeler: "₹3,200",
      commercial: "₹5,500"
    },
    timings: "Mon-Sun: 8:30 AM - 6:30 PM",
    location: { lat: 18.0078, lng: 79.5834 },
    website: "https://www.moderndrivingwarangal.com",
    image: "/placeholder.svg"
  }
];

// Sample penalty points for traffic violations
export const penaltyPoints = [
  {
    id: 1,
    violation: "Speeding (exceeding limit by 10-20 km/h)",
    points: 2,
    fine: "₹1,000",
    description: "Driving faster than the posted speed limit by 10-20 km/h.",
    category: "Moving Violation"
  },
  {
    id: 2,
    violation: "Speeding (exceeding limit by more than 20 km/h)",
    points: 3,
    fine: "₹2,000",
    description: "Driving faster than the posted speed limit by more than 20 km/h.",
    category: "Moving Violation"
  },
  {
    id: 3,
    violation: "Running a red light",
    points: 4,
    fine: "₹5,000",
    description: "Crossing an intersection when the traffic signal is red.",
    category: "Moving Violation"
  },
  {
    id: 4,
    violation: "Not wearing a seatbelt",
    points: 2,
    fine: "₹1,000",
    description: "Driver or passengers not wearing seatbelts while the vehicle is in motion.",
    category: "Safety Violation"
  },
  {
    id: 5,
    violation: "Not wearing a helmet (two-wheeler)",
    points: 2,
    fine: "₹1,000",
    description: "Riding a two-wheeler without wearing a protective helmet.",
    category: "Safety Violation"
  },
  {
    id: 6,
    violation: "Using a mobile phone while driving",
    points: 3,
    fine: "₹1,500",
    description: "Using a handheld mobile phone or similar device while operating a vehicle.",
    category: "Distracted Driving"
  },
  {
    id: 7,
    violation: "Driving without a valid license",
    points: 5,
    fine: "₹5,000",
    description: "Operating a vehicle without a valid driving license.",
    category: "Documentation Violation"
  },
  {
    id: 8,
    violation: "Driving under influence of alcohol/drugs",
    points: 6,
    fine: "₹10,000 or imprisonment",
    description: "Operating a vehicle while under the influence of alcohol or drugs.",
    category: "Serious Violation"
  },
  {
    id: 9,
    violation: "Driving an unregistered vehicle",
    points: 3,
    fine: "₹5,000",
    description: "Operating a vehicle that is not properly registered with the RTO.",
    category: "Documentation Violation"
  },
  {
    id: 10,
    violation: "Dangerous driving",
    points: 6,
    fine: "₹5,000 or imprisonment",
    description: "Operating a vehicle in a manner dangerous to the public.",
    category: "Serious Violation"
  }
];

// More sample data can be added as needed for other features
