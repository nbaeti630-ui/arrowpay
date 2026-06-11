/**
 * Copyright 2026 ArrowPay.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  CheckCircle,
  Wallet,
  Globe,
  UserPlus,
  ArrowRightLeft,
  Fuel,
} from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col items-center w-full px-5">
      {/* Hero Section */}
      <section className="w-full max-w-6xl space-y-16 py-8">
        <div className="flex flex-col items-center gap-8">
          {/* Main headline */}
          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-4">
              <UserPlus className="w-8 h-8 text-blue-500" />
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-pink-300 to-rose-400 arrow-shimmer leading-tight">
              Pay Freelancers & Remote Teams, Fast as an Arrow
            </p>
            <p className="mt-4 text-xl md:text-2xl text-center text-muted-foreground">
              ArrowPay lets you send USDC payments to anyone, anywhere - fast, low-cost, and fully transparent.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Regulatory Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Global Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Instant Settlement</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="w-full space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Everything You Need to Pay Your Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Wallet className="w-8 h-8 text-blue-500" />}
              title="Secure USDC Wallets"
              description="Keep your funds safe in built-in USDC wallets. No crypto experience needed to get started."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-green-500" />}
              title="Pay Anyone, Anywhere"
              description="Send payments to freelancers and remote teams worldwide, across multiple blockchains in seconds."
            />
            <FeatureCard
              icon={<ArrowRightLeft className="w-8 h-8 text-amber-500" />}
              title="Multi-Chain Payouts"
              description="Pay across different networks effortlessly. Recipients get USDC on the chain they prefer."
            />
             <FeatureCard
              icon={<Fuel className="w-8 h-8 text-pink-500" />}
              title="Zero Gas Hassle"
              description="We cover the network fees for you. Your team receives the full amount, with no hidden costs."
            />
          </div>
        </section>
      </section>

      {/* How It Works Section - Full width background */}
      <section className="w-full bg-gradient-to-b from-background to-muted/50 py-16 rounded-xl">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start px-5">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-4 mb-4">
                <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Account</h3>
              <p className="text-sm text-muted-foreground">
                Sign up and set up ArrowPay in minutes.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-4 mb-4">
                <Wallet className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Add Recipients</h3>
              <p className="text-sm text-muted-foreground">
                Add your freelancers and team by wallet address.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/50 rounded-full p-4 mb-4">
                <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Send Payout</h3>
              <p className="text-sm text-muted-foreground">
                Pay everyone at once with a single click.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-pink-100 dark:bg-pink-900/50 rounded-full p-4 mb-4">
                <CheckCircle className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track & Verify</h3>
              <p className="text-sm text-muted-foreground">
                See every payment and its on-chain proof in Payout History.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full max-w-5xl py-16 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Pay Your Team the Easy Way?
          </h2>
          <p className="text-lg text-muted-foreground">
            Start paying your team with ArrowPay today.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/auth/sign-up">
            <Button size="lg">Get Started Now</Button>
          </Link>
           <Link href="https://developers.circle.com" target="_blank">
            <Button variant="outline" size="lg">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-5 text-center text-sm text-muted-foreground">
          © 2026 ArrowPay. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
};
