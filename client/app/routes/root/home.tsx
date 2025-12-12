import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { 
  CheckCircle, 
  Layout, 
  Users, 
  Zap, 
  ArrowRight, 
  Layers, 
  Code2, 
  Github, 
  Twitter 
} from "lucide-react";

export function meta() {
  return [
    { title: "TaskWell - Master Your Tasks" },
    { name: "description", content: "The ultimate task management tool for individuals and teams." },
  ];
}

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Layout className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                TaskWell
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#about" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">About</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/sign-in" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
                Login
              </Link>
              <Link to="/sign-up">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v1.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
            Master Your Tasks, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Alone or Together.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            The ultimate task management tool for individuals and teams. 
            Streamline your workflow, collaborate in real-time, and achieve your goals with TaskWell.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/sign-up">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12 text-base shadow-lg shadow-indigo-200">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-200 hover:bg-slate-50 text-slate-700">
                Live Demo
              </Button>
            </Link>
          </div>

          {/* Hero Visual Placeholder */}
          <div className="relative max-w-5xl mx-auto rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-slate-50 aspect-[16/9] group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white/50 z-0"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center p-8">
                <Layout className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Dashboard Preview</p>
              </div>
            </div>
            {/* Decorative UI Elements */}
            <div className="absolute top-4 left-4 right-4 h-12 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center px-4 gap-2 z-20">
               <div className="h-3 w-3 rounded-full bg-red-400"></div>
               <div className="h-3 w-3 rounded-full bg-amber-400"></div>
               <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to ship.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              TaskWell provides the essential tools to keep your projects on track, 
              whether you're flying solo or managing a large team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Individual Tracking</h3>
              <p className="text-slate-500 leading-relaxed">
                Stay focused on your personal goals. Create private boards, set priorities, 
                and track your daily progress with ease.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-violet-100 rounded-xl flex items-center justify-center mb-6 text-violet-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Team Collaboration</h3>
              <p className="text-slate-500 leading-relaxed">
                Invite members, assign tasks, and share boards seamlessly. 
                Keep everyone aligned on project objectives and deadlines.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6 text-teal-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Updates</h3>
              <p className="text-slate-500 leading-relaxed">
                Never miss a beat. See changes as they happen, get instant notifications, 
                and keep the momentum going without refreshing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Simple, powerful workflow.
              </h2>
              <p className="text-lg text-slate-500 mb-8">
                We believe in keeping things simple. TaskWell is designed to get out of your way 
                so you can focus on the work that matters.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Create a Board</h4>
                    <p className="text-slate-500">Start by creating a workspace and adding project boards.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Add Tasks & Assign</h4>
                    <p className="text-slate-500">Break down projects into actionable tasks and assign them to teammates.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Collaborate & Ship</h4>
                    <p className="text-slate-500">Track progress, leave comments, and move tasks to completion.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative">
               {/* Abstract representation of the workflow */}
               <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4">
                     <div className="h-8 w-8 bg-indigo-100 rounded-md"></div>
                     <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4 ml-8">
                     <div className="h-8 w-8 bg-violet-100 rounded-md"></div>
                     <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-4 ml-16">
                     <div className="h-8 w-8 bg-teal-100 rounded-md"></div>
                     <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Badge */}
      <section className="py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Built with modern technologies</p>
          <div className="flex justify-center items-center gap-8 text-slate-400">
             <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                <span className="font-medium">React</span>
             </div>
             <div className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span className="font-medium">Express</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-current rounded-sm opacity-50"></div> {/* Placeholder for Tailwind */}
                <span className="font-medium">Tailwind CSS</span>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 p-1 rounded-md">
                  <Layout className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">TaskWell</span>
              </div>
              <p className="text-slate-500 text-sm">
                Making productivity simple for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 TaskWell. All rights reserved.
            </p>
            <div className="flex gap-4 text-slate-400">
              <Github className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-indigo-500 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;