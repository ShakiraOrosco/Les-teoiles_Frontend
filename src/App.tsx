import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Usuarios from "./pages/usuarios/Usuarios";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Toaster } from "sonner";
import ServiciosAdicionalesPage from "./pages/Bienes/Servicios/ServiciosAdicionales";
import HabitacionPage from "./pages/Bienes/Habitacion/Habitaciones";


// Páginas Informativas
import Homes from "./pages/Informativa/Homes";
import Contactanos from "./pages/Informativa/Contactanos";
import SobreNosotros from "./pages/Informativa/SobreNosotros";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import Reserva from "./pages/Reservas/Reservas";
import ReservaHospedaje from "./pages/Reservas/Reserva_Hospedaje";
import ReservaEventos from "./pages/Reservas/Reserva_Eventos";
import ReservasPage from "./pages/AdReservas/Reserva_Hospedaje/Reserva_Hospedaje";

export default function App() {
  return (
    <>
      <Toaster toastOptions={{ duration: 3000 }} position="top-left" theme="light" visibleToasts={1} richColors closeButton />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Páginas Informativas (SIN Layout del Dashboard) */}
          <Route index path="/" element={<Homes />} />  {/* PÁGINA PRINCIPAL */}
          <Route path="/home" element={<Homes />} />
          <Route path="/contactanos" element={<Contactanos />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/reservas" element={<Reserva />} />
          <Route path="/reservas/hospedaje" element={<ReservaHospedaje />} />
          <Route path="/reservas/eventos" element={<ReservaEventos />} />

          {/* Dashboard Layout */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>}>
            <Route path="/dashboard" element={<Home />} />  {/* Dashboard ahora en /dashboard */}

            {/* Others Page */}
             {/*Crud de Usuarios */}
            <Route path="/profile" element={<Usuarios/>} />
            
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />            

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/*Crud Bienes */}
            <Route path="/Bienes/Servicios" element={<ServiciosAdicionalesPage />} />
            <Route path="/Bienes/Habitacion" element={<HabitacionPage />} />
            <Route path="/AdReservas/Reserva_Hospedaje" element={<ReservasPage />} />


          </Route>

          {/* Auth Pages */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}