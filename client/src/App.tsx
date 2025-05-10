import { Provider } from "react-redux";
import { store, persist } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import NavigateContainer from "@/navigate";
import '@/configs/locale/i18n.ts'
import '@/configs/axios.ts'
import { Loading } from '@/pages'
import {TooltipProvider} from "@/components/ui";

const queryClient = new QueryClient()

const App = () => {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persist}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={100}>
          <Toaster/>
          <Loading/>
          <NavigateContainer/>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
};

export default App;
