'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Layers, Brain, Image as ImageIcon, Type, Play } from 'lucide-react'

interface Particle {
  left: number
  top: number
  animationDelay: number
  animationDuration: number
}

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Generate particles only on client side to avoid hydration mismatch
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 10 + Math.random() * 10,
      }))
    )
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-weavy-bg-primary text-weavy-text-primary overflow-x-hidden">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-weavy-bg-primary/95 backdrop-blur-xl border-b border-weavy-border shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-8 h-8 bg-gradient-to-br from-weavy-accent to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-weavy-text-primary to-weavy-accent bg-clip-text text-transparent">
              Weavy
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="#features" 
              className="text-sm hover:text-weavy-accent transition-all duration-300 hover:scale-110"
            >
              Features
            </Link>
            <Link 
              href="#workflows" 
              className="text-sm hover:text-weavy-accent transition-all duration-300 hover:scale-110"
            >
              Workflows
            </Link>
            <Link
              href="/workflow"
              className="px-4 py-2 bg-weavy-accent hover:bg-weavy-accent-hover rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-weavy-accent/50"
            >
              Start Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-32 pb-20 px-6 relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-weavy-accent/10 via-transparent to-purple-600/10 animate-gradient-xy" />
        
        <div className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-weavy-text-primary via-weavy-accent to-purple-400 bg-clip-text text-transparent animate-gradient animate-pulse-slow">
            Artistic Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-weavy-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node-based platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/workflow"
              className="group px-8 py-4 bg-weavy-accent hover:bg-weavy-accent-hover rounded-lg text-lg font-medium flex items-center gap-2 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-weavy-accent/50 animate-bounce-slow"
            >
              Start Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border-2 border-weavy-border hover:border-weavy-accent rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-weavy-bg-secondary"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-weavy-accent/30 rounded-full animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        ref={featuresRef}
        className="py-20 px-6 bg-weavy-bg-secondary relative"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-weavy-text-primary to-weavy-accent bg-clip-text text-transparent">
              Use all AI models, together at last
            </h2>
            <p className="text-center text-weavy-text-secondary mb-8 max-w-2xl mx-auto text-lg">
              AI models and professional editing tools in one node-based platform. Turn creative vision into scalable workflows without compromising quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Brain,
                title: 'Run Any LLM',
                description: 'Connect to Google Gemini and other AI models. Chain multiple models together for complex workflows.',
                gradient: 'from-weavy-accent to-purple-600',
                delay: '0s',
              },
              {
                icon: ImageIcon,
                title: 'Image Processing',
                description: 'Upload, process, and analyze images. Support for multimodal AI inputs with vision capabilities.',
                gradient: 'from-pink-500 to-rose-500',
                delay: '0.2s',
              },
              {
                icon: Type,
                title: 'Text Processing',
                description: 'Create, edit, and chain text content. Build complex text transformation pipelines.',
                gradient: 'from-emerald-500 to-green-600',
                delay: '0.4s',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-weavy-bg-tertiary border border-weavy-border rounded-lg hover:border-weavy-accent transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-weavy-accent/20 animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-weavy-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-weavy-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Zap,
                title: 'Node-Based Workflow',
                description: 'Visual workflow builder with drag-and-drop nodes. Connect nodes to create powerful AI pipelines.',
              },
              {
                icon: Layers,
                title: 'Professional Tools',
                description: 'All the editing tools you need in one seamless workflow. Export, import, and share your creations.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-weavy-bg-tertiary border border-weavy-border rounded-lg hover:border-weavy-accent transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <feature.icon className="w-8 h-8 text-weavy-accent mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-weavy-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-weavy-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows Section */}
      <section id="workflows" className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-weavy-text-primary to-weavy-accent bg-clip-text text-transparent">
              Explore Our Workflows
            </h2>
            <p className="text-center text-weavy-text-secondary mb-8 max-w-2xl mx-auto text-lg">
              From multi-layer compositing to matte manipulation, Weavy keeps up with your creativity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Product Listing Generator',
                description: 'Automatically generate Amazon listings, Instagram captions, and SEO descriptions from product images.',
                icon: '🛍️',
              },
              {
                title: 'Content Creation',
                description: 'Create and transform content across multiple formats with AI-powered workflows.',
                icon: '✍️',
              },
              {
                title: 'Image Analysis',
                description: 'Analyze images and extract insights using vision AI models.',
                icon: '🔍',
              },
            ].map((workflow, index) => (
              <div
                key={index}
                className="group p-6 bg-weavy-bg-secondary border border-weavy-border rounded-lg hover:border-weavy-accent transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-weavy-accent/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 inline-block">
                  {workflow.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-weavy-accent transition-colors">
                  {workflow.title}
                </h3>
                <p className="text-weavy-text-secondary leading-relaxed">
                  {workflow.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-weavy-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-weavy-accent/5 via-purple-600/5 to-weavy-accent/5 animate-gradient-xy" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-weavy-text-primary via-weavy-accent to-purple-400 bg-clip-text text-transparent">
            Artificial Intelligence + Human Creativity
          </h2>
          <p className="text-xl text-weavy-text-secondary mb-8 leading-relaxed">
            Weavy is a new way to create. We're bridging the gap between AI capabilities and human creativity, to continue the tradition of craft in artistic expression. We call it <span className="text-weavy-accent font-semibold">Artistic Intelligence</span>.
          </p>
          <Link
            href="/workflow"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-weavy-accent hover:bg-weavy-accent-hover rounded-lg text-lg font-medium transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-weavy-accent/50"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-weavy-border py-12 px-6 bg-weavy-bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-weavy-accent to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Weavy</span>
            </div>
            <div className="flex gap-6 text-sm text-weavy-text-secondary">
              <Link href="#features" className="hover:text-weavy-accent transition-colors">
                Features
              </Link>
              <Link href="#workflows" className="hover:text-weavy-accent transition-colors">
                Workflows
              </Link>
              <Link href="/workflow" className="hover:text-weavy-accent transition-colors">
                Start Building
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-weavy-text-secondary">
            <p>Weavy © 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
        
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 8s ease infinite;
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
