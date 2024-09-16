'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; 
import Modal from '@/components/Modal';

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      router.push('/product');
    }
  }, [router]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      setTimeout(() => {
        console.log(user.displayName + " You Are Successfully Logged In");
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error("Error during login:", error);
      // Mostrar un mensaje de error en el UI si es necesario
    }
  };

  return (
    <>
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="card-title">Login</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
              />
              {errors.email && <span className="text-red-500">Email is required</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                {...register("password", { required: true })}
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
              />
              {errors.password && <span className="text-red-500">Password is required</span>}
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
