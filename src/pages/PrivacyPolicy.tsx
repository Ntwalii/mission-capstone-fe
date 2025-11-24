import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Link, ArrowRight } from "lucide-react";
import { Button } from "react-day-picker";
import { NavLink } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Rwanda Trade Pulse</span>
            </div>
          </NavLink>
        </div>
      </header>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-foreground leading-relaxed">
              Your privacy is important to us. It is our policy to respect your
              privacy regarding any information we may collect from you across
              our agricultural trade intelligence platform.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                1. Information we collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We only ask for personal information when we truly need it to
                provide a service to you. We collect it by fair and lawful
                means, with your knowledge and consent. We also let you know why
                we're collecting it and how it will be used.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                2. How we use your information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We only retain collected information for as long as necessary to
                provide you with your requested service. What data we store,
                we'll protect within commercially acceptable means to prevent
                loss and theft, as well as unauthorized access, disclosure,
                copying, use or modification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                3. Sharing your information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We don't share any personally identifying information publicly
                or with third-parties, except when required to by law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">4. Links to other sites</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Our website may link to external sites that are not operated by
                us. Please be aware that we have no control over the content and
                practices of these sites, and cannot accept responsibility or
                liability for their respective privacy policies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Your rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                You are free to refuse our request for your personal
                information, with the understanding that we may be unable to
                provide you with some of your desired services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">6. Contact us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about how we handle user data and
                personal information, feel free to contact us.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
