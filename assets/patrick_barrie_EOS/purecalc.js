//  Solving Cubic Equations of State
//  Javascript program written by Patrick Barrie
//  with online "help" on how the calculation is performed
//  Program is Copyright Patrick J. Barrie 30 October 2003
//  Please acknowledge me if you use it!


// main routine to do the calculation

function calculation(form)
{
	R = 8.3145;
	Tc = parseFloat(form.Tc.value);
	Pc = parseFloat(form.Pc.value);
	Wc = parseFloat(form.Wc.value);
	T = parseFloat(form.T.value);	
	P = form.P.value;

	eos = 0;
	for (var i = 0; i<5; i++)
        {
		if (form.eos[i].checked) eos = i+1;
	}

	var paramsab = new Array(3);
	var coeffs = new Array(5);
	var Z = new Array(4);
	var depfns = new Array(3);
	var depfns2 = new Array(3);
	var state = new Array(3);

// check entries on form are sensible:

	var temp1 = checkcritparams();
	var temp2 = checkparams();
	if ((!(temp1))||(!(temp2)))
	{
	return false;
	}

	Tr = T/Tc;
	
// calculate the coefficients of the cubic equation 

	paramsab = calcab();
	coeffs = calccoeffs(paramsab[1],paramsab[2]);

// solve the cubic equation for Z

	Z = solvecubic(coeffs[0],coeffs[1],coeffs[2]);

// determine fugacity coefficient of 1st root and departure functions 

	depfns = calcdepfns(coeffs[3],coeffs[4],paramsab[0],Z[0]);

// determine fugacity coefficient of 2nd root (if applicable)

	if (Z[2]>0)
	{
	depfns2 = calcdepfns(coeffs[3],coeffs[4],paramsab[0],Z[2]);
	}
	else
	{
	depfns2[0]=""; depfns2[1]=""; depfns2[2]="";
	}

// now determine the state(s)

	state = getstate(Z[3],Z[2],depfns[0],depfns2[0]);

// now get molar volumes and round answers to 4 or 5 signficant figures

        var vol0=Z[0]*R*T/(P*1E5);
        var vol1="";
        var vol2="";
        Z[0]=Z[0].toPrecision(4);
        vol0=vol0.toPrecision(4);
        depfns[0]=depfns[0].toPrecision(4);
        depfns[1]=depfns[1].toPrecision(5);
        depfns[2]=depfns[2].toPrecision(4);

        if (Z[3]<0) 
	{
        Z[1]=Z[1].toPrecision(4);
        Z[2]=Z[2].toPrecision(4);
        }

        if (Z[2]>0) 
	{
        vol2=Z[2]*R*T/(P*1E5);
        vol2=vol2.toPrecision(4);
        depfns2[0]=depfns2[0].toPrecision(4);
        depfns2[1]=depfns2[1].toPrecision(5);
        depfns2[2]=depfns2[2].toPrecision(4);
        }

// now return values to form

	form.Z0.value = Z[0];
	form.Z1.value = Z[1];
	form.Z2.value = Z[2];
	form.state0.value = state[0];
	form.state1.value = state[1];
	form.state2.value = state[2];
	form.vol0.value = vol0;
	form.vol2.value = vol2;
	form.phi0.value = depfns[0];
	form.phi2.value = depfns2[0];
	form.Hdep0.value = depfns[1];
	form.Hdep2.value = depfns2[1];
	form.Sdep0.value = depfns[2];
	form.Sdep2.value = depfns2[2];

	return true;
}

// end of main calculation script

// below are the functions used in the main calculation script

// get the critical parameters of the substance

function filling(form)
{
	var params = new Array(3);

        var substance=form.substance.value;

        if (substance!=1)
        {
        params = lookupcritical(substance);
        form.Tc.value=params[0];
        form.Pc.value=params[1];
        form.Wc.value=params[2];
        }
        else
        {
        form.Tc.value="";
        form.Pc.value="";
        form.Wc.value="";
        }
}

// look up Tc, Pc and Wc if a particular substance is selected

function lookupcritical(substance)
{
	var t=new Array(20), p=new Array(20), w=new Array(20);
	t[1]=0; p[1]=0; w[1]=0;
	t[2]=126.1; p[2]=33.94; w[2]=0.040;
	t[3]=154.6; p[3]=50.43; w[3]=0.022;
	t[4]=33.3; p[4]=12.97; w[4]=-0.215;
	t[5]=304.2; p[5]=73.82; w[5]=0.228;
	t[6]=190.6; p[6]=46.04; w[6]=0.011;
	t[7]=305.4; p[7]=48.80; w[7]=0.099;
	t[8]=369.8; p[8]=42.49; w[8]=0.152;
	t[9]=425.2; p[9]=37.97; w[9]=0.193;
	t[10]=469.7; p[10]=33.69; w[10]=0.249;
	t[11]=507.4; p[11]=30.12; w[11]=0.305;
	t[12]=282.4; p[12]=50.32; w[12]=0.085;
	t[13]=364.8; p[13]=46.13; w[13]=0.142;
	t[14]=308.3; p[14]=61.39; w[14]=0.187;
	t[15]=562.2; p[15]=48.98; w[15]=0.211;
	t[16]=591.8; p[16]=41.09; w[16]=0.264;
	t[17]=647.3; p[17]=221.2; w[17]=0.344;

	return Array(t[substance],p[substance],w[substance]);
}

// check that the critical parameters entered are sensible

function checkcritparams()
{
        if ((Tc==0)||(Pc==0))
        {
                alert('Please enter critical parameters');
                return false;
        }
        if (Tc<0)
        {
                alert('Critical temperature cannot be negative!');
                return false;
        }
        if (Pc<0)
        {
                alert('Critical pressure cannot be negative!');
                return false;
        }

        if ((isNaN(Tc))||(isNaN(Pc))||(isNaN(Wc)))
        {
                alert('Critical parameters must be numbers');
                return false;
        }

        return true;
}

// check that T and P are entered are sensible

function checkparams()
{
        if ((T==0)||(P==0))
        {
                alert('Please enter T and P of interest');
                return false;
        }
        if (T<0)
        {
                alert('Absolute temperature cannot be negative!');
                return false;
        }
        if (P<0)
        {
                alert('Pressure cannot be negative!');
                return false;
        }

        if (isNaN(T))
        {
                alert('Temperature must be a number');
                return false;
        }
        if (isNaN(P))
        {
                alert('Pressure must be a number');
                return false;
        }

        return true;
}

// calculate a and b parameters (depending on eos)

function calcab()
{
	var alpha, kappa;
	var a, b;
	switch (eos)
	{
	case 1:
                a = 27*R*R*Tc*Tc/(64*Pc*1E5);
                b = R*Tc/(8*Pc*1E5);
		kappa = 0;
        break
        case 2:
                a = 0.42748*R*R*Math.pow(Tc,2.5)/(Pc*1E5);
                b = 0.08664*R*Tc/(Pc*1E5);
		kappa = 0;
	break
        case 3:
                kappa = 0.480 + 1.574*Wc - 0.176*Wc*Wc;
                alpha = Math.pow(1+kappa*(1-Math.sqrt(T/Tc)),2);
                a = 0.42748*R*R*Tc*Tc*alpha/(Pc*1E5);
                b = 0.08664*R*Tc/(Pc*1E5);
        break
        case 4:
                kappa = 0.37464 + 1.54226*Wc - 0.26992*Wc*Wc;
                alpha = Math.pow(1+kappa*(1-Math.sqrt(Tr)),2);
                a = 0.45724*R*R*Tc*Tc*alpha/(Pc*1E5);
                b = 0.07780*R*Tc/(Pc*1E5);
        break
	case 5:
		kappa = 0.134 + 0.508*Wc - 0.0467*Wc*Wc;
		alpha = Math.exp((2.00+0.836*Tr)*(1-Math.pow(Tr,kappa)));
                a = 0.45724*R*R*Tc*Tc*alpha/(Pc*1E5);
                b = 0.07780*R*Tc/(Pc*1E5);
	break
        default:
                kappa = 0; a = 0; b = 0;
        }

	return Array(kappa,a,b);
}

// calculate coefficients in the cubic equation of state

function calccoeffs(a,b)
{
        var A, B;
	var C0, C1, C2;
	switch (eos)
        {
        case 1:
                A = a*P*1E5/Math.pow(R*T,2);
                B = b*P*1E5/(R*T);
                C2 = -1 - B;
                C1 = A;
                C0 = -A*B;
        break
        case 2:
                A = a*P*1E5/(Math.sqrt(T)*Math.pow(R*T,2));
                B = b*P*1E5/(R*T);
                C2 = -1;
                C1 = A - B - B*B;
                C0 = -A*B;
        break
        case 3:
                A = a*P*1E5/Math.pow(R*T,2);
                B = b*P*1E5/(R*T);
                C2 = -1;
                C1 = A - B - B*B;
                C0 = -A*B;
        break
        case 4:
                A = a*P*1E5/Math.pow(R*T,2);
                B = b*P*1E5/(R*T);
                C2 = -1+B;
                C1 = A - 3*B*B - 2*B;
                C0 = -A*B + B*B + B*B*B;
        break
        case 5:
                A = a*P*1E5/Math.pow(R*T,2);
                B = b*P*1E5/(R*T);
                C2 = -1+B;
                C1 = A - 3*B*B - 2*B;
                C0 = -A*B + B*B + B*B*B;
        break
        default:
                C2 = 0; C1 = 0; C0 = 0;
        }

        return Array(C0,C1,C2,A,B);
}

// function for solving cubic equations

function solvecubic(C0,C1,C2)
{
        var Q1 = C2*C1/6 - C0/2 - C2*C2*C2/27;
        var P1 = C2*C2/9 - C1/3;
        var D = Q1*Q1 - P1*P1*P1;
        var temp, temp1, temp2;
	var Z0, Z1, Z2;
        if (D>=0)
        {
                temp1 = Math.pow(Math.abs(Q1+Math.sqrt(D)),0.3333333333);
                temp1 = temp1 * (Q1 + Math.sqrt(D)) / Math.abs(Q1 + Math.sqrt(D));
                temp2 = Math.pow(Math.abs(Q1-Math.sqrt(D)),0.3333333333);
                temp2 = temp2 * (Q1 - Math.sqrt(D))/Math.abs(Q1 - Math.sqrt(D));
                Z0 = temp1 + temp2 - C2/3;
                Z1 = "";
                Z2 = "";
        }
        else
        {
                temp1 = Q1*Q1/(P1*P1*P1);
                temp2 = Math.sqrt(1-temp1)/Math.sqrt(temp1);
                temp2 = temp2 * Q1/Math.abs(Q1);
                var Phi = Math.atan(temp2);
                if (Phi<0) {
                        Phi=Phi+Math.PI; }
                Z0 = 2*Math.sqrt(P1)*Math.cos(Phi/3) - C2/3;
                Z1 = 2*Math.sqrt(P1)*Math.cos((Phi+2*Math.PI)/3) - C2/3;
                Z2 = 2*Math.sqrt(P1)*Math.cos((Phi+4*Math.PI)/3) - C2/3;
                if (Z0<Z1) {
                        temp = Z0; Z0 = Z1; Z1 = temp; }
                if (Z1<Z2) {
                        temp = Z1; Z1 = Z2; Z2 = temp; }
                if (Z0<Z1) {
                        temp = Z0; Z0 = Z1; Z1 = temp; }
        }

        return Array(Z0,Z1,Z2,D);
}

// calculate fugacity coefficient and departure functions

function calcdepfns(A,B,kappa,Z)
{
        var phi, Hdep, Sdep;
	switch (eos)
        {
        case 1:
        phi = Math.exp(Z - 1 - Math.log(Z-B) - A/Z);
        Hdep = R*T*(Z - 1 - A/Z);
        Sdep = R*Math.log(Z-B);
        break
        case 2:
        phi = Math.exp(Z - 1 - Math.log(Z-B) - A*Math.log(1+B/Z)/B);
        Hdep = R*T*(Z - 1 - 1.5*A*Math.log(1+B/Z)/B);
        Sdep = R*(Math.log(Z-B)-0.5*A*Math.log(1+B/Z)/B);
        break
        case 3:
        phi = Math.exp(Z - 1 - Math.log(Z-B) - A*Math.log(1+B/Z)/B);
        var temp1 = Math.sqrt(Tr);
        var temp2 = kappa*temp1/(1+kappa*(1-temp1));
        Hdep = R*T*(Z - 1 - A*(1+temp2)*Math.log(1+B/Z)/B);
        Sdep = R*(Math.log(Z-B) - A*temp2*Math.log(1+B/Z)/B);
        break
        case 4:
        var temp = Math.log((Z+2.414213562*B)/(Z-0.414213562*B));
        phi = Math.exp(Z - 1 - Math.log(Z-B) - A*temp/(2.828427125*B));
        var temp1 = Math.sqrt(Tr);
        var temp2 = -kappa*temp1/(1+kappa*(1-temp1));
        Hdep = R*T*(Z - 1 + A*(temp2-1)*temp/(2.828427125*B));
        Sdep = R*(Math.log(Z-B) + A*temp2*temp/(2.828427125*B));
        break
	case 5:
        var temp = Math.log((Z+2.414213562*B)/(Z-0.414213562*B));
        phi = Math.exp(Z - 1 - Math.log(Z-B) - A*temp/(2.828427125*B));
	var temp1 = Math.pow(Tr,kappa);
	var temp2 = 0.836*Tr*(1-(kappa+1)*temp1) - 2.00*kappa*temp1;
        Hdep = R*T*(Z-1 + A*(temp2-1)*temp/(2.828427125*B));
        Sdep = R*(Math.log(Z-B) + A*temp2*temp/(2.828427125*B));
        break
	default:
        phi = 0; Hdep = ""; Sdep = "";
        }

        return Array(phi,Hdep,Sdep);
}

// work out which state(s) are present

function getstate(D,Z2,phi0,phi2)
{
        var state0="";
        var state1="";
        var state2="";
        if (D>=0)
        {
        state0 = "only real root";
        }
        else
        {
                state1 = "no meaning";
                if ((Z2>0)&&(phi0<phi2))
                {
                state0 = "vapour (stable)";
                state2 = "liquid (metastable)";
                }
                if ((Z2>0)&&(phi0>phi2))
                {
                state0 = "vapour (metastable)";
                state2 = "liquid (stable)";
                }
                if ((Z2>0)&&(phi0.toPrecision(4)==phi2.toPrecision(4)))
                {
                state0 = "vapour (stable)";
                state2 = "liquid (stable)";
                }
                if (Z2<0)
                {
                state2 = "no meaning";
                state0 = "only sensible root";
                }
        }

        return Array(state0,state1,state2);
}

// end of Javascript
