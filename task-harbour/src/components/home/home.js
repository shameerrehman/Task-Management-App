import './home.css';


function Home() {

  return (
    <div className="Home">


    <div className="features" id="features">
        <div style={{padding: "50px", textAlign: 'center', width: '100%'}}>
        <h1>Task Harbor - Project Management App</h1>
        <h2>Welcome to Task Harbor</h2>
        <p>Effortlessly manage your tasks and projects with our powerful and user-friendly application.</p>
        </div>

        <div className="feature">
            <h3>Task Creation</h3>
            <p>Create and organize tasks for your projects with ease.</p>
        </div>
        <div className="feature">
            <h3>Task Editing & Deletion</h3>
            <p>Edit and delete tasks as your project requirements evolve.</p>
        </div>
        <div className="feature">
            <h3>Project Leads</h3>
            <p>Assign project leads to oversee and manage specific projects.</p>
        </div>
        <div className="feature">
            <h3>Estimates</h3>
            <p>Set project estimates to track progress and timelines.</p>
        </div>
        <div className="feature">
            <h3>Data Tracking</h3>
            <p>Efficiently track and analyze project data for better decision-making.</p>
        </div>
    </div>

    <div className="contact" id="contact">
        <h2>Contact Us</h2>
        <p>Have questions or need more information? Reach out to us!</p>
        <p>Email: info@taskharbor.com</p>
        <p>Phone: (555) 123-4567</p>
    </div>
    </div>
  );
}

export default Home;
