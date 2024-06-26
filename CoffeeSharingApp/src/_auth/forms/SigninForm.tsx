import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"

import { SigninValidation } from "@/lib/validation"
import { z } from "zod"
import { useUserContext } from "@/context/AuthContext"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"

const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      return toast({ title: "Sign in failed. Please try again." })
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      
      navigate("/");
    } else {
      return toast({ title: "Sign in failed. Please try again." });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col gap-2">
        <img src="/assets/images/coffee-icon.svg" alt="logo" style={{ width: '50px', height: '50px' }} />
        <p className="font-sans text-2xl md:h1-bold pt-5 sm:pt-12">Welcome to <span style={{ color: '#914025' }}>Coffee Master</span></p>
        <p className="font-sans text-light-4 small-medium md:base-regular">Get to know your daily coffee habits.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {
              isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader />Loading...
                </div>
              ) : "Login"
            }
          </Button>
          <p className="text-small-regular text-dark-4 text-center mt-2">Don't have an account?
            <Link to="/sign-up" className="text-small-semibold ml-1" style={{ color: '#ba522f' }}>Register now</Link>
          </p>
        </form>
      </div>


    </Form>
  )
}

export default SigninForm