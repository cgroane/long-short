export default function ProfilePage() {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img

          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Profile" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Profile Page</h2>
        <p>This is the profile page component styled with DaisyUI.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}