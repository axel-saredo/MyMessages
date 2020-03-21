import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Coach } from "./coach.model";

const BACKEND_URL = environment.apiUrl + "/coach";

@Injectable({ providedIn: "root" })
export class CoachesService {
  private coaches: Coach[] = [];
  private coachesUpdated = new Subject<{
    coaches: Coach[];
    coachCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCoaches(coachesPerPage: number) {
    const queryParams = `?limit=${coachesPerPage}`;
    this.http
      .get<{ count: number; rows: any[] }>(BACKEND_URL + queryParams)
      .pipe(
        map(coachesData => {
          return {
            coaches: coachesData.rows.map((coach: Coach) => {
              return {
                id: coach.id,
                displayName: coach.displayName,
                description: coach.description,
                imagePath: coach.imagePath
              };
            }),
            maxCoaches: coachesData.count
          };
        })
      )
      .subscribe(transformedCoachData => {
        this.coaches = transformedCoachData.coaches;
        this.coachesUpdated.next({
          coaches: [...this.coaches],
          coachCount: transformedCoachData.maxCoaches
        });
      });
  }

  getCoachUpdateListener() {
    return this.coachesUpdated.asObservable();
  }

  getCoach(id: string) {
    return this.http.get<any>(BACKEND_URL + id);
  }

  // addPost(title: string, content: string, image: File) {
  //   const postData = new FormData();
  //   postData.append("title", title);
  //   postData.append("content", content);
  //   postData.append("image", image, title);
  //   this.http
  //     .post<{ message: string; post: Post }>(BACKEND_URL, postData)
  //     .subscribe(responseData => {
  //       this.router.navigate(["/"]);
  //     });
  // }

  // updatePost(id: string, title: string, content: string, image: File | string) {
  //   let postData: Post | FormData;
  //   if (typeof image === "object") {
  //     postData = new FormData();
  //     postData.append("id", id);
  //     postData.append("title", title);
  //     postData.append("content", content);
  //     postData.append("image", image, title);
  //   } else {
  //     postData = {
  //       id: id,
  //       title: title,
  //       content: content,
  //       imagePath: image,
  //       creator: null
  //     };
  //   }
  //   this.http.put(BACKEND_URL + id, postData).subscribe(response => {
  //     this.router.navigate(["/"]);
  //   });
  // }

  // deletePost(postId: string) {
  //   return this.http.delete(BACKEND_URL + postId);
  // }
}
