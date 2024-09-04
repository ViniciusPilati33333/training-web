import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import { z } from "@/pt-br-zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useMutation } from "@tanstack/react-query";
import { Field } from "./ui/field";
import { ErrorMessage } from "./ui/error-message";
import { AppleIcon, ChromeIcon, LogInIcon } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useNavigate } from "@tanstack/react-router";
import barberShop from "@/assets/barberShop.jpg";
import { FirebaseError } from "firebase/app";
import { useToast } from "@/hooks/use-toast";

const User = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const useLogic = () => {
  const navigate = useNavigate({ from: "/" });
  const { toast } = useToast();

  const { mutate: login } = useMutation({
    mutationFn: ({ email, password }: z.infer<typeof User>) => {
      return signInWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            toast({
              variant: "destructive",
              title: "Erro!",
              description: "Este email não é valido.",
            });
            break;
          case "auth/user-disabled":
            toast({
              variant: "destructive",
              title: "Erro!",
              description: "Este usuário foi desativado.",
            });
            break;
          case "auth/user-not-found":
            toast({
              variant: "destructive",
              title: "Erro!",
              description: "Este usuário não foi encontrado.",
            });
            break;
          case "auth/wrong-password":
            toast({
              variant: "destructive",
              title: "Erro!",
              description: "Senha inválida ou indefinida.",
            });
            break;

          default:
            toast({
              variant: "destructive",
              title: "Erro!",
              description: "Não foi possivel realizar a operação.",
            });
            break;
        }
        return;
      }
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Não foi possivel realizar a operação.",
      });
    },
  });

  return {
    login,
  };
};

export function LoginPage() {
  const { login } = useLogic();

  return (
    <div className="flex items-center justify-center w-full h-[100vh]">
      <img
        src={barberShop}
        alt="Barbearia"
        className="static w-full h-[100vh]"
      />
      <div className="flex items-center justify-center absolute sm:top-16">
        <div className="flex flex-col justify-center border rounded w-full min-w-96 max-w-md p-8 space-y-6 bg-white">
          <div className="flex items-start justify-center space-x-2">
            <LogInIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Barbearia REACT
            </h1>
          </div>
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            Faça seu login.
          </h2>
          <Formik
            validationSchema={toFormikValidationSchema(User)}
            initialValues={{ email: "", password: "" }}
            onSubmit={login}
          >
            {({ isValid }) => (
              <Form className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <Field
                    name="email"
                    id="email"
                    type="email"
                    placeholder="user@email.com"
                    className="w-full mt-1"
                  />
                  <p className="flex">
                    &nbsp;
                    <ErrorMessage name="email" />
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <Field
                    name="password"
                    id="password"
                    type="password"
                    placeholder="******"
                    className="w-full mt-1"
                  />
                  <p className="flex">
                    &nbsp;
                    <ErrorMessage name="password" />
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id="remember" />
                    <Label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-600"
                    >
                      Remember me?
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-blue-600">
                    Forgot Password
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white"
                  disabled={!isValid}
                >
                  Continuar
                </Button>
              </Form>
            )}
          </Formik>
          <div className="text-center text-gray-600">
            Fazer login com outras contas?
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="ghost" className="p-2">
              <ChromeIcon className="w-6 h-6" />
            </Button>
            <Button variant="ghost" className="p-2">
              <AppleIcon className="w-6 h-6" />
            </Button>
          </div>
          <div className="text-center text-gray-600 flex gap-1">
            Não possui uma conta?
            <a href="#" className="text-blue-600">
              Clique aqui para cadastrar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
