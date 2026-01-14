🧭 Campus Indoor Navigation System (3D Digital Twin)

A web-based indoor navigation system that enables inter-class navigation inside a multi-floor campus building using a 3D digital twin, logical navigation anchors, and a guided camera experience.

This project is built under the Open Innovation theme and falls within the domain of Smart Infrastructure & Indoor Wayfinding.

🚀 Problem Statement

Large academic campuses and school buildings often have:

Complex multi-floor layouts

Multiple staircases and corridors

Frequently changing classrooms

No reliable indoor navigation support

New students and visitors frequently get lost, especially when navigating between floors.
Existing solutions like Google Maps do not support indoor, floor-aware navigation.

💡 Proposed Solution

This project provides:

A 3D digital twin of a real campus building

Logical navigation points (rooms, corridors, staircases)

Graph-based shortest-path routing

A guided camera that visually leads users through the building

The solution is model-agnostic, scalable, and can be adapted to:

Colleges & schools

Hospitals

Malls

Airports

Public infrastructure buildings

🧠 Core Concept

The system separates visual representation from navigation logic:

3D Model (Visual Layer)
        +
Navigation Graph (Logical Layer)
        +
Pathfinding + Guided Camera


This separation makes the system flexible, extensible, and open, aligning strongly with the Open Innovation theme.

🛠️ Technologies Used

Programming Language: JavaScript (ES6+)

Frontend Framework: React.js

Build Tool: Vite

3D Engine: Three.js

React–3D Integration: @react-three/fiber

3D Utilities: @react-three/drei

3D Model Format: glTF / GLB

3D Modeling Tool: Blender

Navigation Logic: Graph-based routing

Pathfinding Algorithm: Dijkstra’s Algorithm

Data Format: JSON

Version Control: Git & GitHub

🧭 Navigation Features

Inter-class navigation across multiple floors

Staircase-aware routing

Visual navigation path inside the 3D model

Guided camera that follows the navigation route

Floor transitions with clear visual context

📦 3D Model Setup (Important)

Due to size constraints, the main 3D campus model is not included directly in the repository.

🔗 Model Download Link

Download the optimized campus model from Google Drive:
👉 https://drive.google.com/file/d/13itFopW1RefhuCRB40nUOfTGN4FT_c7T/view?usp=sharing

📂 How to use the model

After downloading:

Create the following folder (if it doesn’t exist):

public/models/


Place the model as:

public/models/campus.glb


The application will automatically load the model from this location.

ℹ️ Large 3D assets are intentionally excluded from version control to keep the repository lightweight and maintainable. This is standard industry practice for web-based 3D applications.

▶️ How to Run the Project Locally
# Install dependencies
npm install

# Start development server
npm run dev


Then open the browser at:

http://localhost:5173

🌍 Domain & Theme Alignment

Hackathon Theme: Open Innovation

Primary Domain:

Smart Infrastructure

Indoor Navigation & Wayfinding

Secondary Domains:

Spatial Computing

Digital Twin Technology

EdTech (Application Layer)

🧪 Current Status

3D campus model successfully integrated

Navigation anchors defined logically

Guided camera navigation implemented

Multi-floor routing supported

🔮 Future Enhancements

QR-code based “You are here” positioning

Floor-wise model loading for performance

AR-based navigation using WebXR

Indoor positioning using BLE / Wi-Fi

Accessibility-friendly navigation paths

🏁 Conclusion

This project demonstrates how 3D digital twins combined with logical navigation graphs can solve real-world indoor navigation problems in large infrastructures.

The solution is open, extensible, and scalable, making it suitable not only for campuses but for a wide range of public and private buildings.