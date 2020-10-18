function PointNearPolyline(Points, APoint, AScale=1, ASens=3) {
  var Result = false;
  var i, j;
  var X1, Y1, X2, Y2, XP1, YP1, XP2, YP2, a, b, c, x, y, h, Xh;
  var XPItem;
  var XP = [];
  var APointOut;

  for (i=0; i<Points.length-1; i++) {
    APointOut = false;
    X1 = Points[i][0];
    Y1 = Points[i][1];
    X2 = Points[i+1][0];
    Y2 = Points[i+1][1];
    if (X1>X2) {x=X1; y=Y1; X1=X2; Y1=Y2; X2=x; Y2=y;}

    if (X2==X1) {
      h = Math.abs(APoint[0]-X1);
      if (Y1>Y2) {x=X1; y=Y1; X1=X2; Y1=Y2; X2=x; Y2=y;}
      if ((APoint[1]<Y1) || (APoint[1]>Y2)) APointOut = true;
    } else
    if (Y2==Y1) {
      h = Math.abs(APoint[1]-Y1);
      if ((APoint[0]<X1) || (APoint[0]>X2)) APointOut = true;
    } else {
      XP1 = APoint[0];
      YP1 = (XP1-X1)*(Y2-Y1)/(X2-X1)+Y1;
      YP2 = APoint[1];
      XP2 = (YP2-Y1)*(X2-X1)/(Y2-Y1)+X1;
      a = Math.abs(APoint[1]-YP1);
      b = Math.abs(APoint[0]-XP2);
      c = Math.sqrt(Math.pow(XP2-XP1, 2)+Math.pow(YP2-YP1, 2));
      if ((c==0) || (a==0) || (b==0)) {
        h = 0;
        if ((APoint[0]<X1) || (APoint[0]>X2)) APointOut = true;
      } else {
        x = (Math.pow(b, 2)-Math.pow(a, 2)+Math.pow(c, 2))/(2*c);
        h = Math.sqrt(Math.pow(b, 2)-Math.pow(x, 2));
        Xh = XP1+(Math.pow(h, 2)-Math.pow(x, 2)+Math.pow(b, 2))/(2*b)*Math.sign(XP2-XP1);
        if (((Xh<X1) && (Xh<X2)) || ((Xh>X1) && (Xh>X2))) APointOut = true;
      }
    }
    if (APointOut) {
      x = Math.sqrt(Math.pow(X1-APoint[0], 2)+Math.pow(Y1-APoint[1], 2));
      y = Math.sqrt(Math.pow(X2-APoint[0], 2)+Math.pow(Y2-APoint[1], 2));
      if (x<y) h = x; else h = y;
    }
    if (h<=(ASens/AScale)) Result = true;
  }
  return(Result);
}
