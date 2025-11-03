export default function ForgotPasswordPage() {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1559703248-3b8a6f3d2f5b.webp"
          alt="forgot password" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Forgot Password Page</h2>
        <p>This is the forgot password page component styled with DaisyUI.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Reset Password</button>
        </div>
      </div>
    </div>
  );
}