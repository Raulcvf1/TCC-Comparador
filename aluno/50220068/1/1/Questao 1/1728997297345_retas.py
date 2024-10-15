n,a,b,c=input().split(),list(),list(),0
for i in range(0,int(n[0])):
    x=input().split()
    a.append(int(x[0])),b.append(int(x[1]))
for i in range(0,int(n[0])):
    for j in range(0,int(n[0])):
        if a[i]!=a[j] and int(n[1])<=(b[i]+(b[j]*-1))/((a[i]*-1)+a[j])<=int(n[2]):c=c+1
print(int(c/2))