import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, getSession, useSession } from "next-auth/react";
import { EventHandler, useState } from "react";
import { api } from "../utils/api";
import { redirect } from "next/dist/server/api-utils";

const Home: NextPage = () => {
  const {data: passwordData} = api.admin.getPassword.useQuery();

  return (
    <>
      <Head>
        <title>Book Management</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Bletsch <span className="text-[hsl(280,100%,70%)]">Book</span> Boys
          </h1>
          <div className="flex flex-col items-center gap-2">
              {/*{passwordData ? <AuthShowcase/> : <CreateAdmin/>}*/}
            <AuthShowcase></AuthShowcase>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const sessionData = useSession();

  const handleClick = async ()=>{
    if (sessionData.status==='authenticated'){
      const res = await signOut();
      console.log(res)
    }
    const res = await signIn("credentials",{ callbackUrl: '/dashboard'},);
    console.log(res)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={handleClick}
      >
        Sign in
      </button>
    </div>
  );
};

// const CreateAdmin: React.FC = () => {
//   const SALT_ROUNDS = 10;
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const adminPass = api.admin.createAdminPassword.useMutation();
//
//
//
//   function handlePasswordSubmit(pass: string, confirmPass: string){
//       console.log(pass)
//       if (pass === confirmPass){
//         adminPass.mutate({
//           password: pass
//         });
//       }
//   }
//
//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-white">Please create an Admin Password</p>
//       <label id="password" className="text-white">Enter Password:</label>
//       <input type="text" id="first" name="first" onChange={e => {setNewPassword(e.currentTarget.value)}}/>
//       <label id="confirm" className="text-white">Re-Type Password:</label>
//       <input type="text" id="confirm" name="confirm" onChange={e => {setConfirmPassword(e.currentTarget.value)}}/>
//       <button type="submit" className="text-white" onClick={e => handlePasswordSubmit(newPassword, confirmPassword)}>Submit</button>
//     </div>
//   );
// };
